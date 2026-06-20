import { assetUrl } from "@/lib/assets";

export default function BannerImage() {
  return (
    <section className="banner-image-section" aria-label="Meaningful Plushies feature image">
      <img src={assetUrl("/assets/home-2.png")} alt="" />
    </section>
  );
}
