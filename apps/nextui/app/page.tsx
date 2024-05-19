import { cn } from "@/utils/cn";
import { Card, CardBody, Chip, Image } from "@nextui-org/react";

async function getData() {
  const res = await fetch(
    `http://127.0.0.1:1337/api/poems?${new URLSearchParams({
      "populate[poet][fields][0]": "name",
      "populate[poet][fields][1]": "dynasty",
    })}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 4fe7fedb14c3fb5a75350103d928e9b9657a85af747fbcc511fa2a37ecf685b47e4a30cf8a44e2d3da0014f7acb253358eb80f6d7c17507afb4ba4251f0a233c4847fb56b4110bf22b92ffd67f44bc426fdf1ab70d8f6c7225cbf61c6843515d48fa1dbd5b22f6f83ebab5f077371ade01a64886b776a21754190249a298e094",
      },
    }
  );

  return res.json();
}

export default async function Page() {
  const { data, meta } = await getData();

  console.log(JSON.stringify(data[0]));

  return (
    <div className="grid lg:gap-6 px-4 lg:px-0 gap-4 lg:mt-8 mt-4 max-w-screen-sm w-full mx-auto">
      {data.map((item, i) => (
        <Card className="w-full cursor-pointer" key={item.id}>
          <CardBody className="flex flex-row flex-wrap p-0 md:flex-nowrap">
            <div className="px-4 py-5 flex flex-col justify-between">
              <div>
                <h3 className="text-large font-medium">
                  {item.attributes.title.replace(/·/, " · ")}
                </h3>
                <p className="mt-1 mb-3 font-light">
                  {item.attributes.poet.data.attributes.dynasty.split(".")[1]} ·{" "}
                  {item.attributes.poet.data.attributes.name}
                </p>
                <div
                  className="flex flex-col text-default-500"
                  dangerouslySetInnerHTML={{
                    __html: item.attributes.content.replaceAll("\n", "<br />"),
                  }}
                ></div>
              </div>
              <div
                className={cn("flex flex-wrap gap-2 mt-8", {
                  hidden: i % 3,
                })}
              >
                <Chip color="primary" variant="flat">
                  唐诗三百首
                </Chip>
                <Chip color="primary" variant="flat">
                  陆游集
                </Chip>
                <Chip color="secondary" variant="flat">
                  宋朝诗人集选
                </Chip>
                <Chip color="warning" variant="flat">
                  我是歌手第二季
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
