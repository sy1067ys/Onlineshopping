import img11 from "figma:asset/ecf4de84a1119d30b76803a05cf45ebab0e82bbd.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[226px] left-0 top-0 w-[385px]" data-name="ロゴメーカー プロジェクト (1) 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[170.78%] left-0 max-w-none top-[-34.7%] w-full" src={img11} />
        </div>
      </div>
      <div className="absolute bg-gradient-to-r from-[#98d1f1] from-[8.256%] h-[226px] left-[385px] right-0 to-[#d7b8ee] top-0" />
      <div className="absolute h-[103px] left-[355px] top-[28px] w-[671px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 671 103">
          <path d="M0 0H671V103H0V0Z" fill="var(--fill-0, #FFFDFD)" id="Rectangle 2" />
        </svg>
      </div>
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Itim:Regular','Noto_Sans_JP:Regular',sans-serif] from-[#ff61ad] leading-[normal] left-[385px] right-[57px] text-[40px] text-[transparent] to-[#03b9f0] top-[28px] whitespace-nowrap" style={{ fontVariationSettings: "'wght' 400" }}>
        アイデア × デザイン × ショッピング
      </p>
      <p className="absolute bg-clip-text bg-gradient-to-r font-['Itim:Regular','Noto_Sans_JP:Regular',sans-serif] from-[#03b9f0] leading-[normal] left-[544px] right-[189px] text-[36px] text-[transparent] to-[#ff61ad] top-[87px] whitespace-nowrap" style={{ fontVariationSettings: "'wght' 400" }}>
        面白いを見つけよう!!
      </p>
    </div>
  );
}