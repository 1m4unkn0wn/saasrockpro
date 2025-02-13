// @@@ pwned by 1m4unkn0wn @@@
/* eslint-disable no-console */

import { getClientIPAddress } from "~/utils/server/IpUtils";
import { IpAddressDto } from "../dtos/IpAddressDto";
import { cachified, clearCacheKey } from "~/utils/cache.server";
import { db } from "~/utils/db.server";
import { addBlacklistAttempt, addToBlacklist, findInBlacklist } from "~/utils/db/blacklist.db.server";

// TODO: Test with your own IP address
const LOCAL_DEV_IP = "189.203.100.82";

async function log(
  request: Request,
  {
    action,
    description,
    metadata,
    block,
  }: {
    action: string;
    description: string;
    metadata?: { [key: string]: any };
    block?: string;
  }
) {
  let ip = getClientIPAddress(request)?.toString() || "";
  if (process.env.NODE_ENV === "development") {
    ip = LOCAL_DEV_IP;
  }
  const ipAddress = await getOrCreateIpAddressLookup(ip);
  if (!ipAddress) {
    return;
  }

  validateIp(ipAddress);

  let blacklistedIp = await findInBlacklist("ip", ip);
  if (!blacklistedIp && block) {
    blacklistedIp = await addToBlacklist({ type: "ip", value: ip });
  }
  if (blacklistedIp) {
    await addBlacklistAttempt(blacklistedIp);
    await db.ipAddressLog.create({
      data: {
        ipAddressId: ipAddress.id,
        ip,
        url: new URL(request.url).pathname,
        action: action,
        description,
        metadata: null,
        error: block || "Blacklisted",
        success: false,
      },
    });
    throw Error("Unauthorized.");
  } else {
    await db.ipAddressLog.create({
      data: {
        ipAddressId: ipAddress.id || null,
        ip,
        url: new URL(request.url).pathname,
        action,
        description,
        metadata: metadata ? JSON.stringify(metadata, null, 2) : null,
        error: null,
        success: true,
      },
    });
  }
}

async function getOrCreateIpAddressLookup(ip: string): Promise<IpAddressDto | null> {
  let provider: string | null = null;
  if (process.env.IPSTACK_API_KEY) {
    provider = "ipstack";
  } else if (process.env.IPAPIIS_API_KEY) {
    provider = "ipapi.is";
  }
  const item = await cachified({
    key: `ipAddress:${ip}`,
    disabled: ip === LOCAL_DEV_IP,
    getFreshValue: () =>
      db.ipAddress.findUnique({
        where: { ip },
      }),
  });
  if (item) {
    // eslint-disable-next-line no-console
    // console.log("[getOrCreateIpAddressLookup] Found in cache", ip);
    try {
      const dto: IpAddressDto = {
        id: item.id,
        ip,
        provider: item.provider,
        type: item.type,
        countryCode: item.countryCode,
        countryName: item.countryName,
        regionCode: item.regionCode,
        regionName: item.regionName,
        city: item.city,
        zipCode: item.zipCode,
        latitude: item.latitude ? Number(item.latitude) : null,
        longitude: item.longitude ? Number(item.longitude) : null,
        metadata: JSON.parse(item.metadata),
      };
      return dto;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("[getOrCreateIpAddressLookup] Error parsing metadata", error);
      return null;
    }
  }

  const dto: IpAddressDto = {
    id: "",
    ip,
    provider: provider || "",
    type: "",
    countryCode: "",
    countryName: "",
    regionCode: "",
    regionName: "",
    city: "",
    zipCode: "",
    latitude: null,
    longitude: null,
    metadata: null,
  };

  if (provider === "ipstack") {
    try {
      const response = await fetch(`http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`);
      const data = await response.json();
      if (!response.ok || data.error) {
        // eslint-disable-next-line no-console
        console.log("[ipstack] Error fetching IP data", {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
        });
      } else {
        dto.provider = "ipstack";
        dto.type = data.type;
        dto.countryCode = data.country_code;
        dto.countryName = data.country_name;
        dto.regionCode = data.region_code;
        dto.regionName = data.region_name;
        dto.city = data.city;
        dto.zipCode = data.zip;
        dto.latitude = data.latitude;
        dto.longitude = data.longitude;
        dto.metadata = data;
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("[ipstack] Error parsing IP data", error);
      // return null;
    }
  } else if (provider === "ipapi.is") {
    try {
      const response = await fetch(`https://api.ipapi.is/?ip=${ip}&key=${process.env.IPAPIIS_API_KEY}`);
      const data = await response.json();
      if (!response.ok || data.error) {
        // eslint-disable-next-line no-console
        console.log("[ipapi.is] Error fetching IP data", {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
        });
      } else {
        let ipapiis: IpApiIsDto = data;
        dto.provider = "ipapi.is";
        // dto.type = ipapiis.type;
        dto.countryCode = ipapiis.location?.country_code || "";
        dto.countryName = ipapiis.location?.country || "";
        dto.regionCode = ipapiis.rir;
        dto.regionName = "";
        dto.city = ipapiis.location?.city || "";
        dto.zipCode = ipapiis.location?.zip || "";
        dto.latitude = ipapiis.location?.latitude || 0;
        dto.longitude = ipapiis.location?.longitude || 0;
        dto.metadata = ipapiis;
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("[ipapi.is] Error parsing IP data", error);
      // return null;
    }
  }

  const createdIp = await db.ipAddress
    .create({
      data: {
        ip,
        provider: dto.provider,
        type: dto.type,
        countryCode: dto.countryCode,
        countryName: dto.countryName,
        regionCode: dto.regionCode,
        regionName: dto.regionName,
        city: dto.city,
        zipCode: dto.zipCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        metadata: JSON.stringify(dto.metadata, null, 2),
      },
    })
    .then((item) => {
      clearCacheKey(`ipAddress:${ip}`);
      return item;
    });

  dto.id = createdIp.id;
  return dto;
}

function validateIp(ipAddress: IpAddressDto) {
  if (!ipAddress.metadata) {
    return;
  }
  if (ipAddress.provider === "ipapi.is") {
    let data: IpApiIsDto = ipAddress.metadata as IpApiIsDto;
    console.log("[validateIp]", {
      is_bogon: data.is_bogon,
      is_mobile: data.is_mobile,
      is_crawler: data.is_crawler,
      is_datacenter: data.is_datacenter,
      is_tor: data.is_tor,
      is_proxy: data.is_proxy,
      is_vpn: data.is_vpn,
      is_abuser: data.is_abuser,
    });
    if (data.is_bogon) {
      // throw Error("Unauthorized.");
    }
    if (data.is_mobile) {
      // throw Error("Unauthorized.");
    }
    if (data.is_crawler) {
      throw Error("Unauthorized.");
    }
    if (data.is_datacenter) {
      // throw Error("Unauthorized.");
    }
    if (data.is_tor) {
      // throw Error("Unauthorized.");
    }
    if (data.is_proxy) {
      // throw Error("Unauthorized.");
    }
    if (data.is_vpn) {
      // throw Error("Unauthorized.");
    }
    if (data.is_abuser) {
      throw Error("Unauthorized.");
    }
    if (data.location) {
      const blockCountryCodes: string[] = [];
      if (blockCountryCodes.includes(data.location.country_code)) {
        throw Error("Unauthorized.");
      }
    }
  }
}

type IpApiIsDto = {
  ip: string;
  rir: string;
  is_bogon: boolean;
  is_mobile: boolean;
  is_crawler: boolean;
  is_datacenter: boolean;
  is_tor: boolean;
  is_proxy: boolean;
  is_vpn: boolean;
  is_abuser: boolean;
  company?: {
    name: string;
    abuser_score: string;
    domain: string;
    type: string;
    network: string;
    whois: string;
  };
  abuse?: {
    name: string;
    address: string;
    country: string;
    email: string;
    phone: string;
  };
  datacenter?: {
    datacenter: string;
    network: string;
    country: string;
    region: string;
    city: string;
  };
  asn?: {
    asn: number;
    abuser_score: string;
    route: string;
    descr: string;
    country: string;
    active: boolean;
    org: string;
    domain: string;
    abuse: string;
    type: string;
    created: string;
    updated: string;
    rir: string;
    whois: string;
  };
  location?: {
    continent: string;
    country: string;
    country_code: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    zip: string;
    timezone: string;
    local_time: string;
    local_time_unix: number;
    is_dst: boolean;
    accuracy: number;
  };
  elapsed_ms: number;
};

export default {
  log,
  getOrCreateIpAddressLookup,
};
