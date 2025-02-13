// @@@ pwned by 1m4unkn0wn @@@
import { useState, useEffect, useRef, Fragment } from "react";
import { ActionFunction, LoaderFunction, LoaderFunctionArgs, MetaFunction, redirect, useFetcher, useLoaderData } from "react-router";
import { Link, useSearchParams } from "react-router";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import ImageOrSvg from "~/components/images/ImageOrSvg";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import Modal from "~/components/ui/modals/Modal";
import { NewsletterForm } from "~/modules/pageBlocks/components/blocks/marketing/newsletter/NewsletterVariantSimple";
import WarningBanner from "~/components/ui/banners/WarningBanner";
import clsx from "clsx";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getLinkTags } from "~/modules/pageBlocks/services/.server/pagesService";
import { getDefaultSiteTags } from "~/modules/pageBlocks/utils/defaultSeoMetaTags";
import { BarChart } from "@tremor/react";
import ExternalLinkEmptyIcon from "~/components/ui/icons/ExternalLinkEmptyIcon";
import { SurveyDto, SurveyResultsDto, SurveryItemResultDto, SurveyItemDto } from "~/modules/surveys/dtos/SurveyDtos";
import { SurveyWithDetails, getSurveyBySlug } from "~/modules/surveys/db/surveys.db.server";
import SurveyUtils from "~/modules/surveys/utils/SurveyUtils";
import { getAnalyticsInfo } from "~/utils/analyticsCookie.server";
import { getClientIPAddress } from "~/utils/server/IpUtils";
import { db } from "~/utils/db.server";
import { getSurveySubmissions } from "~/modules/surveys/db/surveySubmissions.db.server";
import { useRootData } from "~/utils/data/useRootData";
import ServerError from "~/components/ui/errors/ServerError";
import NotificationService from "~/modules/notifications/services/.server/NotificationService";
import { getUserInfo } from "~/utils/session.server";
import { getUser } from "~/utils/db/users.db.server";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];

type LoaderData = {
  metatags: MetaTagsDto;
  item: SurveyDto;
  alreadyVoted: boolean;
  canShowResults: boolean;
};
export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  const appConfiguration = await getAppConfiguration({ request });
  if (!appConfiguration.app.features.surveys) {
    throw Response.json({}, { status: 404 });
  }
  const userInfo = await getUserInfo(request);
  const user = userInfo.userId ? await getUser(userInfo.userId) : null;
  const item = await getSurveyBySlug({ tenantId: null, slug: params.slug! });
  if (!item) {
    throw Response.json({ error: "Survey not found" }, { status: 404 });
  }

  const alreadyVoted = await getAlreadyVoted({ item, request });

  const survey = SurveyUtils.surveyToDto(item);
  if (!survey.isPublic) {
    throw Response.json({ error: "Survey not found" }, { status: 404 });
  }
  const searchParams = new URL(request.url).searchParams;
  const successParam = searchParams.get("success") !== null || searchParams.get("results") !== null;
  const submissions = await getSurveySubmissions(item.id);
  let canShowResults = submissions.length > survey.minSubmissions || !!user?.admin || survey.minSubmissions === 0;
  // eslint-disable-next-line no-console
  console.log("survey", { canShowResults, submissions: submissions.length, surveySubmissions: survey.minSubmissions });
  if ((alreadyVoted || survey.minSubmissions === 0) && successParam && canShowResults) {
    survey.results = {
      totalVotes: submissions.length,
      items: [],
    };
    item.items.forEach((surveyItem) => {
      const options = surveyItem.options as SurveyItemDto["options"];
      // change title to shortName if available

      const surveyItemResult: SurveyResultsDto["items"][0] = { item: surveyItem.title, votes: [] };
      options.forEach((option) => {
        const optionSubmissions = submissions
          .flatMap((f) => f.results)
          .filter((r) => {
            if (r.surveItemTitle !== surveyItem.title) {
              return false;
            }
            if (typeof r.value === "string") {
              return r.value === option.title;
            } else if (Array.isArray(r.value)) {
              return r.value.includes(option.title);
            }
            return false;
          });
        let count = optionSubmissions.length;
        let percentage = (count / submissions.length) * 100;
        surveyItemResult.votes.push({
          option: option.shortName || option.title,
          count,
          percentage,
        });
      });
      // options.forEach((option) => {
      //   if (option.shortName) {
      //     option.title = option.shortName;
      //   }
      // });
      survey.results?.items.push(surveyItemResult);
    });
  }

  const data: LoaderData = {
    metatags: [
      { title: `${item.title} | ${getDefaultSiteTags().title}` },
      { description: item.description },
      { property: "og:title", content: `${item.title} | ${getDefaultSiteTags().title}` },
      { property: "og:description", content: item.description },
      {
        property: "og:image",
        content: item.image,
      },
      ...getLinkTags(request),
    ],
    item: survey,
    alreadyVoted,
    canShowResults,
  };
  return data;
};

async function getAlreadyVoted({ item, request }: { item: SurveyWithDetails; request: Request }) {
  const analyticsInfo = await getAnalyticsInfo(request);
  const clientIpAddress = getClientIPAddress(request.headers) ?? "Unknown";
  const existingUserAnalytics = await db.surveySubmission
    .findFirstOrThrow({
      where: { surveyId: item.id, userAnalyticsId: analyticsInfo.userAnalyticsId },
    })
    .catch(() => null);
  const existingIpAddress = await db.surveySubmission
    .findFirstOrThrow({
      where: { surveyId: item.id, ipAddress: clientIpAddress },
    })
    .catch(() => null);

  if (existingUserAnalytics) {
    // eslint-disable-next-line no-console
    console.log("Already voted by cookie", { existingUserAnalytics: existingUserAnalytics.userAnalyticsId });
    return true;
  } else if (existingIpAddress) {
    // eslint-disable-next-line no-console
    console.log("Already voted by IP", { existingIpAddress: existingIpAddress.ipAddress });
    return true;
  }
  return false;
}

export let action: ActionFunction = async ({ request, params }) => {
  const item = await getSurveyBySlug({ tenantId: null, slug: params.slug! });
  if (!item) {
    return Response.json({ error: "Survey not found" }, { status: 404 });
  }

  const analyticsInfo = await getAnalyticsInfo(request);
  const clientIpAddress = getClientIPAddress(request.headers) ?? "Unknown";

  const form = await request.formData();
  const action = form.get("action");
  if (action === "vote") {
    const alreadyVoted = await getAlreadyVoted({ item, request });
    if (alreadyVoted) {
      return Response.json({ error: "You've already voted" }, { status: 400 });
    }
    try {
      const results = JSON.parse(form.get("results") as string) as SurveryItemResultDto[];
      if (results.length === 0) {
        return Response.json({ error: "Results are required" }, { status: 400 });
      } else if (results.length !== item.items.length) {
        return Response.json({ error: "Invalid results" }, { status: 400 });
      }
      if (!analyticsInfo.userAnalyticsId) {
        return Response.json({ error: "You need to enable cookies to vote" }, { status: 400 });
      }
      await db.surveySubmission.create({
        data: {
          surveyId: item.id,
          userAnalyticsId: analyticsInfo.userAnalyticsId,
          ipAddress: clientIpAddress,
          results: {
            createMany: {
              data: results.map((result) => {
                const surveyItem = item.items.find((i) => i.title === result.item);
                if (!surveyItem) {
                  throw new Error("Invalid survey item: " + result.item);
                }
                let value: string | string[] = "";
                if (surveyItem.type === "single-select") {
                  if (result.values.length > 0) {
                    value = result.values[0];
                  }
                } else if (surveyItem.type === "multi-select") {
                  value = result.values;
                }
                return {
                  surveItemTitle: result.item,
                  surveItemType: surveyItem.title,
                  value,
                  other: result.other,
                };
              }),
            },
          },
        },
      });
      await NotificationService.sendToRoles({
        channel: "admin-users",
        notification: {
          message: `Survey submission: ` + item.title,
          action: {
            url: `/admin/help-desk/surveys/${item.id}/submissions`,
          },
        },
      });
      return redirect(`/surveys/${item.slug}?success=true`);
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  }
  return Response.json({ error: "Unknown action" });
};

export default function Surveys() {
  const { t } = useTranslation();
  const rootData = useRootData();
  let data = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const showingResults = searchParams.get("results") !== null || searchParams.get("success") !== null;

  return (
    <div className={clsx("container mx-auto space-y-4 px-4 sm:px-6 lg:px-8", data.item.results ? "" : "")}>
      <HeaderBlock />

      {/* <HeadingBlock
        item={{
          style: "centered",
          headline: data.item.title,
          subheadline: data.item.description || "",
        }}
      /> */}

      <div className={clsx("mx-auto space-y-6", data.item.results ? "max-w-4xl" : "max-w-4xl")}>
        <div className="space-y-3">
          <div className="text-left">
            <BreadcrumbSimple
              menu={[
                { title: t("surveys.title"), routePath: "/surveys" },
                { title: data.item.title, routePath: `/surveys/${data.item.slug}` },
              ]}
            />
            <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight  sm:text-4xl">
                {t("surveys.object")}: {data.item.title}
              </h1>
              {rootData.user?.admin && (
                <div className="flex justify-center">
                  <ButtonPrimary to={`/admin/help-desk/surveys/${data.item.id}/edit`}>{t("shared.edit")}</ButtonPrimary>
                </div>
              )}
            </div>
            <p className="text-muted-foreground mt-2 text-base">{data.item.description}</p>
          </div>
        </div>
      </div>
      <div className={clsx("mx-auto space-y-6", data.item.results ? "max-w-4xl" : "max-w-4xl")}>
        {!data.alreadyVoted && data.item.minSubmissions > 0 && showingResults && (
          <WarningBanner title="You haven't voted yet" text="Please vote to see the results." />
        )}
        <SurveyGroup
          survey={data.item}
          disabled={!data.item.isEnabled || !!data.item.results || data.alreadyVoted}
          alreadyVoted={data.alreadyVoted}
          canShowResults={data.canShowResults}
          showingResults={showingResults}
        />
      </div>
      <FooterBlock />
    </div>
  );
}

function SurveyGroup({
  survey,
  disabled,
  alreadyVoted,
  canShowResults,
  showingResults,
}: {
  survey: SurveyDto;
  disabled: boolean;
  alreadyVoted: boolean;
  canShowResults: boolean;
  showingResults: boolean;
}) {
  const { t } = useTranslation();
  const rootData = useRootData();
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const isLoading = fetcher.state === "submitting";
  const [searchParams, setSearchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState<SurveryItemResultDto[]>(
    survey.items.map((item) => ({
      item: item.title,
      values: rootData.debug ? [item.options[0].title] : [],
    }))
  );

  useEffect(() => {
    setShowModal(searchParams.get("success") ? true : false);
  }, [searchParams]);

  useEffect(() => {
    if (fetcher.data?.success) {
      // toast.success(fetcher.data.success);
      setShowModal(true);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  function canSubmit() {
    const hasAllItemsWithAtLeastOneValue = survey.items.every((item) => {
      const value = results.find((r) => r.item === item.title);
      if (!value) {
        return false;
      }
      if (item.type === "multi-select") {
        return value.values.length > 0;
      }
      return value.values.length === 1;
    });
    return hasAllItemsWithAtLeastOneValue;
  }

  return (
    <fetcher.Form method="post" className="space-y-4">
      <input type="hidden" name="action" value="vote" hidden readOnly />
      <input type="hidden" name="results" value={JSON.stringify(results)} hidden readOnly />
      {/* {JSON.stringify(results)} */}
      {/* <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-medium">
            {survey.title} <span className="text-muted-foreground text-base font-normal">({DateUtils.dateAgo(survey.createdAt)})</span>
          </h2>
        </div>
        <p className="text-muted-foreground text-base">{survey.description}</p>
      </div> */}

      <div
        className={clsx(
          "border-border grid grid-cols-1 gap-6 pt-4"
          // survey.results && survey.items.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-1"
        )}
      >
        {survey.items.map((item, idx) => {
          const value = results.find((r) => r.item === item.title) || {
            item: item.title,
            values: [],
          };
          return (
            <SurveyItem
              key={idx}
              survey={survey}
              item={item}
              value={value}
              disabled={disabled}
              onChange={(value) => {
                setResults((prev) => {
                  const idx = prev.findIndex((r) => r.item === value.item);
                  if (idx === -1) {
                    return [...prev, value];
                  }
                  return [...prev.slice(0, idx), value, ...prev.slice(idx + 1)];
                });
              }}
            />
          );
        })}
      </div>

      {!survey.isEnabled ? (
        <WarningBanner title="Disabled" text="Voting is closed for this survey." />
      ) : //   :
      //   survey.results ? (
      //   <InfoBanner title="Results">
      //     <ul className="">
      //       <li>Total votes: {survey.results.totalVotes}</li>
      //     </ul>
      //   </InfoBanner>
      // )
      null}

      <div className="flex justify-end space-x-2">
        {canShowResults && (
          <Fragment>
            {showingResults ? <ButtonSecondary to="?">Hide Results</ButtonSecondary> : <ButtonSecondary to="?results=true">View Results</ButtonSecondary>}
          </Fragment>
        )}
        {(searchParams.get("success") !== null || searchParams.get("results") !== null) && (
          <ButtonSecondary
            onClick={() => {
              searchParams.delete("success");
              searchParams.delete("results");
              setSearchParams(searchParams);
            }}
          >
            {t("shared.reset")}
          </ButtonSecondary>
        )}
        <LoadingButton isLoading={isLoading} disabled={!canSubmit() || !survey.isEnabled || disabled} type="submit">
          {alreadyVoted ? "You already voted" : <span>{t("shared.submit")}</span>}
        </LoadingButton>
      </div>

      <Modal size="sm" open={showModal} setOpen={() => setShowModal(false)}>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Thanks for your feedback!</h3>
          <p className="text-muted-foreground">Subscribe to saasrock's newsletter to get product updates and more.</p>
          <NewsletterForm onClose={() => setShowModal(false)} />
        </div>
      </Modal>
    </fetcher.Form>
  );
}

// function SurveyItem({
//   survey,
//   item,
//   value,
//   onChange,
//   disabled,
// }: {
//   survey: SurveyDto;
//   item: SurveyItemDto;
//   value: SurveryItemResultDto;
//   onChange: (value: SurveryItemResultDto) => void;
//   disabled: boolean;
// }) {
//   const itemResults = survey.results?.items.find((r) => r.item === item.title);

//   const mainInput = useRef<HTMLInputElement>(null);
//   function focusOtherInput() {
//     setTimeout(() => {
//       mainInput.current?.focus();
//     }, 0);
//   }

//   return (
//     <div className="space-y-1">
//       <div>
//         <div className="flex items-center space-x-2">
//           <h3 className="text-base font-semibold">
//             {/* <span className=" text-muted-foreground font-normal">#{idx + 1})</span> */}
//             {item.title}
//           </h3>
//           {item.categories && (
//             <div className="flex flex-wrap items-center gap-2">
//               {item.categories.map((category, idx) => (
//                 <span key={idx} className="text-muted-foreground bg-secondary rounded-md px-2 py-1 text-xs">
//                   {category}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//         {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
//       </div>
//       <div className={clsx("bg-background border-border rounded-md border p-5", disabled && "bg-secondary")}>
//         <div className="flex justify-between space-x-2">
//           <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
//             {item.options.map((option, idx) => {
//               const optionResults = itemResults?.votes.find((v) => v.option === option.title);
//               return (
//                 <label key={idx} className={clsx("flex select-none items-center space-x-2", disabled ? " cursor-not-allowed " : "cursor-pointer")}>
//                   {item.isMultiple ? (
//                     <Checkbox
//                       name={item.title}
//                       checked={value.values.includes(option.title)}
//                       className={clsx(disabled && "opacity-50")}
//                       onCheckedChange={(e) => {
//                         onChange({
//                           ...value,
//                           values: e ? [...value.values, option.title] : value.values.filter((v) => v !== option.title),
//                         });
//                         if (e && option.isOther) {
//                           focusOtherInput();
//                         }
//                       }}
//                       disabled={disabled}
//                     />
//                   ) : (
//                     <input
//                       type="radio"
//                       name={item.title}
//                       value={option.title}
//                       checked={value.values.includes(option.title)}
//                       required
//                       className={clsx(disabled && "opacity-50")}
//                       disabled={disabled}
//                       onChange={(e) => {
//                         onChange({ ...value, values: [option.title] });
//                         if (option.isOther) {
//                           focusOtherInput();
//                         }
//                       }}
//                     />
//                   )}
//                   <div
//                     className={clsx(
//                       "flex h-9 items-center space-x-2 rounded-md px-4",
//                       value.values.includes(option.title) ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" : "bg-background text-foreground",
//                       disabled && "cursor-not-allowed opacity-50"
//                     )}
//                   >
//                     {option.icon && <ImageOrSvg icon={option.icon} className="h-4 w-4" />}

//                     <div>{option.title}</div>
//                     {optionResults && (
//                       <div className="text-foreground text-sm font-medium">
//                         {optionResults?.percentage.toFixed(0)}%<span className="text-muted-foreground text-xs"> ({optionResults?.count})</span>
//                       </div>
//                     )}
//                   </div>
//                 </label>
//               );
//             })}
//             {item.options.find((o) => o.isOther) && value.values.includes("Other") && (
//               <li className="w-full sm:w-64">
//                 <label className="flex items-center space-x-2">
//                   <Input
//                     ref={mainInput}
//                     type="text"
//                     value={value.other}
//                     onChange={(e) => {
//                       onChange({ ...value, other: e.target.value });
//                     }}
//                     placeholder="Other..."
//                     required={value.values.includes("Other")}
//                     disabled={disabled || !value.values.includes("Other")}
//                   />
//                 </label>
//               </li>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

function SurveyItem({
  survey,
  item,
  value,
  onChange,
  disabled,
}: {
  survey: SurveyDto;
  item: SurveyItemDto;
  value: SurveryItemResultDto;
  onChange: (value: SurveryItemResultDto) => void;
  disabled: boolean;
}) {
  const itemResults = survey.results?.items.find((r) => r.item === item.title);
  const mainInput = useRef<HTMLInputElement>(null);

  function focusOtherInput() {
    setTimeout(() => {
      mainInput.current?.focus();
    }, 0);
  }

  const chartData = itemResults ? itemResults.votes.map((vote) => ({ name: vote.option, Votes: vote.count })) : [];

  return (
    <div className="space-y-1">
      <div>
        <div className="flex justify-between space-x-2">
          <div className="flex h-9 items-center">
            <h3 className="line-clamp-1 text-base font-semibold">{item.title}</h3>
            {item.href && (
              <Link to={item.href} target="_blank" className="hover:bg-secondary ml-1 rounded-md p-2">
                <ExternalLinkEmptyIcon className="h-4 w-4" />
              </Link>
            )}
            {item.categories && (
              <div className="ml-2 flex flex-wrap items-center gap-2">
                {item.categories.map((category, idx) => (
                  <span key={idx} className="text-muted-foreground bg-secondary rounded-md px-2 py-1 text-xs">
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* {item.href && (
            <Link to={item.href}>
              <ExternalLinkEmptyIcon className="h-4 w-4" />
            </Link>
          )} */}
        </div>
        {item.description && !survey.results && <p className="text-muted-foreground text-sm">{item.description}</p>}
      </div>
      <div className={clsx(item.style === "default" && "bg-background border-border rounded-md border p-5", disabled && " opacity-90")}>
        {itemResults ? (
          <BarChart
            className="h-40"
            data={chartData}
            index="name"
            categories={["Votes"]}
            colors={item.color ? [item.color] : ["blue"]}
            valueFormatter={(number) => Intl.NumberFormat("us").format(number).toString()}
            yAxisWidth={48}
          />
        ) : (
          <div className="flex justify-between space-x-2">
            <div
              className={clsx(
                item.style === "default" && "flex flex-wrap items-center gap-x-3 gap-y-2",
                item.style === "grid" && "grid w-full gap-2 md:grid-cols-2"
              )}
            >
              {item.options.map((option, idx) => (
                <div
                  key={idx}
                  className={clsx("flex flex-wrap items-center gap-3", item.style === "grid" && "bg-background border-border rounded-md border px-5 py-3")}
                >
                  <label key={idx} className={clsx("flex select-none items-center space-x-2", disabled ? " cursor-not-allowed " : "cursor-pointer")}>
                    {item.type === "multi-select" ? (
                      <Checkbox
                        name={item.title}
                        checked={value.values.includes(option.title)}
                        className={clsx(disabled && "opacity-50")}
                        onCheckedChange={(e) => {
                          onChange({
                            ...value,
                            values: e ? [...value.values, option.title] : value.values.filter((v) => v !== option.title),
                          });
                          if (e && option.isOther) {
                            focusOtherInput();
                          }
                        }}
                        disabled={disabled}
                      />
                    ) : item.type === "single-select" ? (
                      <input
                        type="radio"
                        name={item.title}
                        value={option.title}
                        checked={value.values.includes(option.title)}
                        required
                        className={clsx(disabled && "opacity-50")}
                        disabled={disabled}
                        onChange={(e) => {
                          onChange({ ...value, values: [option.title] });
                          if (option.isOther) {
                            focusOtherInput();
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={clsx(
                        "flex h-9 items-center space-x-2 rounded-md px-4",
                        disabled
                          ? ""
                          : value.values.includes(option.title)
                          ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                          : "bg-background text-foreground",
                        disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {option.icon && <ImageOrSvg icon={option.icon} className="h-4 w-4" />}
                      <div>{option.title}</div>
                    </div>
                  </label>
                  {option.isOther && value.values.includes(option.title) && (
                    <div className="w-full sm:w-64">
                      <label className="flex items-center space-x-2">
                        <Input
                          ref={mainInput}
                          type="text"
                          value={value.other}
                          onChange={(e) => {
                            onChange({ ...value, other: e.target.value });
                          }}
                          placeholder="Other..."
                          disabled={disabled}
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
