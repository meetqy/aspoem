import Aside from "~/app/_components/Aside";

export default function Page() {
  return (
    <>
      <div className="main-wrapper px-4">
        <ul className="relative list-none border-s border-gray-200 dark:border-gray-700">
          <li className="mb-10 ms-6">
            <span className="btn btn-square btn-circle btn-neutral btn-xs absolute -start-3 flex">
              ·
            </span>
            <div className="items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex">
              <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                just now
              </time>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                Bonnie moved{" "}
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
                >
                  Jese Leos
                </a>{" "}
                to{" "}
                <span className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-normal text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                  Funny Group
                </span>
              </div>
            </div>
          </li>
          <li className="mb-10 ms-6">
            <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
              ·
            </span>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700">
              <div className="mb-3 items-center justify-between sm:flex">
                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                  2 hours ago
                </time>
                <div className="lex text-sm font-normal text-gray-500 dark:text-gray-300">
                  Thomas Lean commented on{" "}
                  <a
                    href="#"
                    className="font-semibold text-gray-900 hover:underline dark:text-white"
                  >
                    Flowbite Pro
                  </a>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs font-normal italic text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-300">
                Hi ya'll! I wanted to share a webinar zeroheight is having
                regarding how to best measure your design system! This is the
                second session of our new webinar series on #DesignSystems
                discussions where we'll be speaking about Measurement.
              </div>
            </div>
          </li>
          <li className="ms-6">
            <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
              ·
            </span>
            <div className="items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex">
              <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                1 day ago
              </time>
              <div className="lex text-sm font-normal text-gray-500 dark:text-gray-300">
                Jese Leos has changed{" "}
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
                >
                  Pricing page
                </a>{" "}
                task status to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  Finished
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Aside />
    </>
  );
}
