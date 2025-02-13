// @@@ pwned by 1m4unkn0wn @@@
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { TestimonialDto } from "~/modules/pageBlocks/components/blocks/marketing/testimonials/TestimonialsBlockUtils";
import ButtonEvent from "../ui/buttons/ButtonEvent";
import UserAvatarBadge from "../core/users/UserAvatarBadge";
import LinkOrAhref from "../ui/buttons/LinkOrAhref";
import clsx from "clsx";
import DateUtils from "~/utils/shared/DateUtils";
import { useTranslation } from "react-i18next";
import Stars from "~/modules/pageBlocks/components/blocks/marketing/testimonials/Stars";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: TestimonialDto[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "100s");
      }
    }
  };

  const colors = [
    "text-green-400",
    "text-yellow-400",
    "text-purple-400",
    "text-blue-400",
    "text-red-400",
    "text-cyan-400",
    "text-indigo-400",
    "text-pink-400",
    "text-rose-400",
    "text-violet-400",
    "text-lime-400",
    "text-emerald-400",
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((testimonial, idx) => {
          let randomColor = "text-yellow-400";
          if (idx < colors.length) {
            randomColor = colors[idx];
          } else {
            const randomIdx = Math.floor(Math.random() * colors.length);
            randomColor = colors[randomIdx];
          }
          return (
            <li
              className={clsx(
                "relative flex w-[350px] max-w-full flex-shrink-0 flex-col justify-between rounded-2xl border border-slate-700 px-8 py-6 md:w-[300px]"
              )}
              style={{
                background: "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
              }}
              key={testimonial.name}
            >
              {testimonial.quoteUrl && (
                <ButtonEvent
                  event={{ action: "click", category: "testimonials", label: "quote", value: testimonial.name }}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 z-10"
                  to={testimonial.quoteUrl}
                />
              )}

              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <div className="relative z-20 mt-6 flex flex-row items-center">
                  <span className="flex flex-col gap-3">
                    {/* <span className=" text-muted-foreground text-sm font-normal leading-[1.6]">{testimonial.name}</span> */}
                    <div className=" -mx-1">
                      <Stars color={randomColor} />
                    </div>
                    <span className=" text-foreground text-sm font-black leading-[1.6]">{testimonial.title}</span>
                  </span>
                </div>
                <span className="line-clamp-6 text-sm font-normal leading-[1.6]">
                  {/* <ShowMoreLinesText lines="4"> */}
                  {testimonial.quote}
                  {/* </ShowMoreLinesText> */}
                </span>
              </blockquote>

              <div className="mt-4 inline-flex items-center">
                {testimonial.avatar ? (
                  <img alt="testimonial" src={testimonial.avatar} className="h-6 w-6 flex-shrink-0 rounded-full object-cover object-center" />
                ) : (
                  <UserAvatarBadge avatar={undefined} className="h-6 w-6 flex-shrink-0 rounded-full object-cover object-center" />
                )}
                <span className="flex flex-grow flex-col pl-4">
                  <LinkOrAhref
                    to={testimonial.personalWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className={clsx("title-font text-left text-xs font-medium", testimonial.personalWebsite && "hover:underline")}
                    // event={{ action: "click", category: "testimonial-user", label: testimonial.name, value: testimonial.personalWebsite ?? "" }}
                  >
                    {testimonial.name}
                  </LinkOrAhref>
                  <span className="text-muted-foreground flex items-center space-x-1 truncate text-sm">
                    {testimonial.role && <div className="truncate">{t(testimonial.role)}</div>}
                    {testimonial.company && (
                      <>
                        <div>@</div>
                        <div className="text-muted-foreground truncate text-sm">
                          {testimonial.companyUrl ? (
                            <ButtonEvent
                              to={testimonial.companyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                              event={{ action: "click", category: "testimonial-company", label: testimonial.company, value: testimonial.companyUrl ?? "" }}
                            >
                              {testimonial.company}
                            </ButtonEvent>
                          ) : (
                            testimonial.company
                          )}
                        </div>
                      </>
                    )}
                    {testimonial.createdAt && (
                      <time className="truncate" dateTime={DateUtils.dateYMDHMSMS(testimonial.createdAt)} title={DateUtils.dateYMDHMSMS(testimonial.createdAt)}>
                        {DateUtils.dateAgo(testimonial.createdAt)}
                      </time>
                    )}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
