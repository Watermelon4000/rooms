import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { LandingFooter } from "@/components/landing/footer";
import { WaterShaderBackground } from "@/components/ui/water-shader-background";

const features = [
  {
    title: "像素级房间编辑",
    description: "20×20 网格随点随放，支持物件字典、自定义属性与多版本草稿。",
  },
  {
    title: "Supabase Realtime",
    description: "房主的每次拖拽都会广播给访问者，编辑体验与多人在线一致。",
  },
  {
    title: "开放的物件协议",
    description: "Tile 数据存储在 Supabase，可扩展到任意尺寸与自定义 schema。",
  },
  {
    title: "即开即用",
    description: "无需安装插件，浏览器内完成建房、预览、分享，适合黑客松与作品集。",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <HeroSection />
      <section className="relative px-4 py-12 sm:px-10 sm:py-32">
        <div className="absolute inset-0 opacity-30">
          <WaterShaderBackground />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl space-y-16">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Feature Stack</p>
            <h2 className="mt-4 text-balance text-4xl font-light tracking-tight sm:text-5xl">
              一切为实时房间而生
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <FeatureSection key={feature.title} title={feature.title} description={feature.description} index={index} />
            ))}
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
