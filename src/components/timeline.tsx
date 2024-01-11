type TimelineProps = {
  date?: string;
  events: {
    icon: React.ReactNode | string;
    title: React.ReactNode | string;
    description: React.ReactNode | string;
    buttonText: React.ReactNode | string;
  }[];
};

export const Timeline: React.FC<TimelineProps> = ({ date, events }) => (
  <div>
    <div className="my-2 ps-2 first:mt-0">
      <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        {date}
      </h3>
    </div>
    {events.map((event, index) => (
      <div key={index} className="flex gap-x-3">
        <div className="relative after:absolute after:bottom-0 after:start-3.5 after:top-7 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 last:after:hidden dark:after:bg-gray-700">
          <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border">
            {event.icon}
          </div>
        </div>
        <div className="grow pb-8 pt-0.5">
          <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {event.description}
          </p>
          <button
            type="button"
            className="-ms-1 mt-1 inline-flex items-center gap-x-2 rounded-lg border border-transparent p-1 text-xs text-gray-500 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            {event.buttonText}
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default Timeline;
