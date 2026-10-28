export function AllCountryKun() {
  return (
    <>
      <div className="flying-orkan" aria-hidden="true">
        <div className="orkan-kun">
          <span className="orkan-pack"><i>¥</i></span>
          <span className="orkan-head"><i className="orkan-eye left" /><i className="orkan-eye right" /><b /></span>
          <span className="orkan-arm arm-left" /><span className="orkan-arm arm-right" />
          <span className="orkan-leg leg-left" /><span className="orkan-leg leg-right" />
        </div>
      </div>
      <section className="mascot-stage" aria-label="オルカンくんが世界を飛び回って資産を育てています">
        <div className="mascot-copy">
          <p className="mascot-kicker">GLOBAL WEALTH FLYER</p>
          <h2>オルカンくん、<br className="sm:hidden" />世界を飛び回り中。</h2>
          <p>株価と為替を追いかけて、画面の中を駆け巡ります。</p>
        </div>
        <div className="runner-lane" aria-hidden="true">
          <span className="runner-speed speed-one" />
          <span className="runner-speed speed-two" />
          <span className="runner-speed speed-three" />
          <div className="coin-trail"><i>¥</i><i>¥</i><i>¥</i></div>
          <div className="coin-goal"><span>¥</span><i /><i /><i /></div>
        </div>
        <div className="mascot-status"><span /> WORLD SCANNING</div>
      </section>
    </>
  );
}
