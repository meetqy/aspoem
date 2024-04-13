import Twikoo from "~/components/twikoo";
import { HeaderMain } from "~/components/ui/header";
import { getDictionary, type Locale } from "~/dictionaries";

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
              {dict.feedback_desc}
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
