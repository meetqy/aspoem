import { HeaderMain } from "~/components/ui/header";
import { getDictionary, getLangText, type Locale } from "~/dictionaries";
import Twikoo from "../poem/[id]/components/twikoo";

export default async function FeedbackPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div>
      <HeaderMain>
        <div className="px-4">
          <span className="text-f200">{dict.menu.feedback}</span>
        </div>
      </HeaderMain>

      <main>
        <div className="p-4">
          <header>
            <h1 className="prose-h1">{dict.menu.feedback}</h1>
            <p className="prose-p text-secondary-foreground">
              {getLangText(
                {
                  "zh-Hans":
                    "可以在此处查看网站的更新日志、未来规划，以及对新增功能的讨论。同时，也可以在此留下您的建议和意见。",
                  "zh-Hant":
                    "可以在此處查看網站的更新日誌、未來規劃，以及對新增功能的討論。同時，也可以在此留下您的建議和意見。",
                },
                params.lang,
              )}
            </p>
          </header>

          <div className="mt-8 space-y-4">
            <Twikoo lang={params.lang} />
          </div>
        </div>
      </main>
    </div>
  );
}
