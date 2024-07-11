"use client";

export default function Home() {
  const py = `lóng sì qú táng huì ， jiāng yī bái dì shēn 。 
 zhōng nián cháng qǐ xiá ， měi yè bì tōng lín 。 
 shōu huò cí shuāng zhǔ ， fēn míng zài xī cén 。 
 gāo zhāi fēi yì chǔ ， xiù qì huō fán jīn 。`;

  const text = `龙似瞿唐会，江依白帝深。
终年常起峡，每夜必通林。
收获辞霜渚，分明在夕岑。
高斋非一处，秀气豁烦襟。`;

  return (
    <>
      <section className="relative h-screen py-16 w-full">
        <div className="container max-w-7xl text-center">
          <h1 className="text-6xl"> 云 </h1>
          <p className="text-2xl mt-2 mb-6">唐·杜甫</p>
          <div className="text-3xl grid gap-y-4 tracking-widest">
            <p>龙似瞿唐会，江依白帝深。</p>
            <p>终年常起峡，每夜必通林。</p>
            <p>收获辞霜渚，分明在夕岑。</p>
            <p>高斋非一处，秀气豁烦襟。</p>
          </div>
        </div>
      </section>
    </>
  );
}
