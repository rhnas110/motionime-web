import "./EventDetail.css";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";

import { MI_API_BASE_URL } from "../../../config/motionime-api.config";
import { EventTitleContext } from "../../../context/EventTitleContext";
import { beautyPath, minimizeString } from "../../../utils/string";
import { scrollTo } from "../../../utils";

import { ButtonEvent } from "../../Elements/Button";
import { MotionImeText } from "../../Elements/MotionIme";

export const EventDetail = () => {
  const { title } = useParams();
  const [event, setEvent] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const { handleTitle } = useContext(EventTitleContext);

  const getEventById = useCallback(async () => {
    try {
      const { results } = await (
        await axios.get(`${MI_API_BASE_URL}/event.json`)
      ).data;

      const event = results?.filter(
        (item) => beautyPath(item?.title) === title,
      );
      setEvent(event[0]);

      const episodes = event[0]?.episodes;
      setEpisodes(episodes);

      handleTitle(event[0]?.title);
    } catch (error) {}
  }, [title, handleTitle]);

  useEffect(() => {
    getEventById();
  }, [getEventById]);
  return (
    <>
      <section className="section">
        {event?.id ? (
          <div className="w-full h-full relative">
            <div className="absolute w-full h-full bg-gradient-to-r from-black"></div>
            <img
              className="w-full h-full object-cover object-center bg-primary"
              src={event?.banner}
              alt={event?.title}
              loading="lazy"
            />
            <div className="absolute w-full top-[20%] p-4 md:p-8 lg:py-16 lg:px-24">
              <Link
                to={"/event"}
                onClick={() => scrollTo(0, 0)}
                className="flex items-center gap-2"
              >
                <FaArrowLeftLong size={20} />
                <span className="underline underline-offset-4">
                  Back to Event
                </span>
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold my-4">
                {event?.title}
              </h1>
              <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
                {minimizeString(event?.desc, 300)}
              </p>
              <div className="flex gap-x-4 my-4">
                <p>Genre :</p>
                <p>{event?.genre}</p>
              </div>
              <div className="flex gap-x-4 text-motion_ime_purple font-semibold mb-6">
                <p>Time :</p>
                <p>{event?.schedule}</p>
              </div>
              <ButtonEvent
                text={`${event?.type === "play" ? "Watch Now" : "Check Now"}`}
                link={event?.link}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-12 h-12 rounded-full animate-spin
          border-4 border-dashed border-motion_ime_purple border-t-transparent"
            ></div>
          </div>
        )}
      </section>

      <section className="w-screen py-16 px-2">
        <div className="max-w-4xl mx-auto py-10 shadow-lg shadow-slate-100/50 rounded card">
          {event?.id ? (
            <>
              {episodes?.length ? (
                <>
                  <div className="bg-motion_ime_purple p-2 font-semibold">
                    {event?.title} Episode List
                  </div>
                  {episodes?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`p-2 flex flex-col sm:flex-row sm:justify-between gap-2 ${
                          index % 2 === 0 ? "bg-primary" : "rgba(22,22,22,1)"
                        }`}
                      >
                        <a
                          href={item?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {event?.title} {item?.title}
                        </a>
                        <p className="opacity-80 text-right">{item?.time}</p>
                      </div>
                    );
                  })}
                  <div className="bg-motion_ime_purple p-2 font-semibold">
                    {event?.title} Episode List
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p>
                    Check on Discord{" "}
                    <MotionImeText isCapital exclamationMarks />
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p>Event Not Found</p>
              <Link
                to={"/event"}
                className="text-motion_ime_purple font-semibold text-lg"
              >
                &#8592; Back
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
