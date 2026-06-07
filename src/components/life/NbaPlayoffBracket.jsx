import React from 'react';
import {
  nbaEasternPlayoffs,
  nbaWesternPlayoffs,
  nbaFinalsBracket,
} from '../../data/lifeContent';
import './NbaPlayoffBracket.css';

const LINE = 'rgba(123, 240, 255, 0.48)';

const ROW = {
  G1: 1,
  S1: 2,
  G2: 3,
  CF: 4,
  G3: 5,
  S2: 6,
  G4: 7,
};

function outcomeLabel(outcome) {
  switch (outcome) {
    case 'exact':
      return 'EXACT +2';
    case 'winner':
      return 'WIN +1';
    case 'wrong':
      return 'MISS';
    case 'pending':
      return 'TBD';
    default:
      return '';
  }
}

function parseMatchup(matchup) {
  const split = matchup.split(' vs ');
  if (split.length < 2) return { top: matchup, bottom: '' };
  return { top: split[0].trim(), bottom: split.slice(1).join(' vs ').trim() };
}

function BracketMatch({ series }) {
  const { top, bottom } = parseMatchup(series.matchup);

  return (
    <article className={`nba-match nba-match--${series.outcome}`} title={series.matchup}>
      <span className="nba-match-badge">{outcomeLabel(series.outcome)}</span>
      <div className="nba-match-teams">
        <span className="nba-match-team">{top}</span>
        <span className="nba-match-team">{bottom}</span>
      </div>
      <p className="nba-match-pick">
        <span className="nba-match-k">Prediction</span> {series.prediction}
      </p>
      <p className="nba-match-result">
        <span className="nba-match-k">Outcome</span> {series.actual || 'TBD'}
      </p>
      {series.note ? <p className="nba-match-note">{series.note}</p> : null}
    </article>
  );
}

function ForkSvg({ yTop, yBottom, yOut, flip = false }) {
  const path = `M 0 ${yTop} H 16 M 0 ${yBottom} H 16 M 16 ${yTop} V ${yBottom} M 16 ${yOut} H 32`;

  if (flip) {
    return (
      <svg className="nba-fork-svg" viewBox="0 0 32 100" preserveAspectRatio="none" aria-hidden="true">
        <g transform="translate(32,0) scale(-1,1)">
          <path d={path} fill="none" stroke={LINE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="nba-fork-svg" viewBox="0 0 32 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} fill="none" stroke={LINE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function WireCell({ col = 2, rowStart, rowEnd, yTop, yBottom, yOut, flip = false }) {
  return (
    <div className="nba-wire" style={{ gridColumn: col, gridRow: `${rowStart} / ${rowEnd}` }}>
      <ForkSvg yTop={yTop} yBottom={yBottom} yOut={yOut} flip={flip} />
    </div>
  );
}

function MatchCell({ series, col, row, align = 'center' }) {
  return (
    <div className={`nba-cell nba-cell--${align}`} style={{ gridColumn: col, gridRow: row }}>
      <BracketMatch series={series} />
    </div>
  );
}

export default function NbaPlayoffBracket() {
  const east = nbaEasternPlayoffs.rounds;
  const west = nbaWesternPlayoffs.rounds;
  const eastR1 = east[0].series;
  const eastR2 = east[1].series;
  const eastR3 = east[2].series[0];
  const westR1 = west[0].series;
  const westR2 = west[1].series;
  const westR3 = west[2].series[0];
  const finals = nbaFinalsBracket.series[0];

  return (
    <div className="nba-bracket-shell">
      <p className="nba-bracket-kicker">My NBA playoffs prediction bracket</p>

      <div className="nba-bracket-scroll">
        <div className="nba-bracket-arena">
          <div className="nba-bracket-titles">
            <span className="nba-bracket-conf-title nba-bracket-conf-title--east">EASTERN</span>
            <span className="nba-bracket-conf-title nba-bracket-conf-title--west">WESTERN</span>
          </div>

          <div className="nba-bracket-labels">
            <span style={{ gridColumn: 1 }}>First Round</span>
            <span style={{ gridColumn: 3 }}>Conf. Semis</span>
            <span style={{ gridColumn: 5 }}>Conf. Finals</span>
            <span style={{ gridColumn: 7 }}>NBA Finals</span>
            <span style={{ gridColumn: 9 }}>Conf. Finals</span>
            <span style={{ gridColumn: 11 }}>Conf. Semis</span>
            <span style={{ gridColumn: 13 }}>First Round</span>
          </div>

          <div className="nba-bracket-grid">
            {/* Eastern first round */}
            <MatchCell series={eastR1[0]} col={1} row={ROW.G1} align="east" />
            <MatchCell series={eastR1[1]} col={1} row={ROW.G2} align="east" />
            <MatchCell series={eastR1[2]} col={1} row={ROW.G3} align="east" />
            <MatchCell series={eastR1[3]} col={1} row={ROW.G4} align="east" />

            <WireCell rowStart={ROW.G1} rowEnd={ROW.G2 + 1} yTop={16.67} yBottom={83.33} yOut={50} />
            <WireCell rowStart={ROW.G3} rowEnd={ROW.G4 + 1} yTop={16.67} yBottom={83.33} yOut={50} />

            {/* Eastern semis */}
            <MatchCell series={eastR2[0]} col={3} row={ROW.S1} align="east" />
            <MatchCell series={eastR2[1]} col={3} row={ROW.S2} align="east" />

            <WireCell rowStart={ROW.S1} rowEnd={ROW.S2 + 1} yTop={10} yBottom={90} yOut={50} col={4} />

            {/* Eastern conf finals + stub toward NBA */}
            <MatchCell series={eastR3} col={5} row={ROW.CF} align="east" />
            <div className="nba-stub nba-stub--east" style={{ gridColumn: 6, gridRow: ROW.CF }} aria-hidden="true" />

            {/* NBA Finals */}
            <MatchCell series={finals} col={7} row={ROW.CF} align="center" />

            {/* Western conf finals + stub from NBA */}
            <div className="nba-stub nba-stub--west" style={{ gridColumn: 8, gridRow: ROW.CF }} aria-hidden="true" />
            <MatchCell series={westR3} col={9} row={ROW.CF} align="west" />

            <WireCell rowStart={ROW.S1} rowEnd={ROW.S2 + 1} yTop={10} yBottom={90} yOut={50} flip col={10} />

            {/* Western semis */}
            <MatchCell series={westR2[0]} col={11} row={ROW.S1} align="west" />
            <MatchCell series={westR2[1]} col={11} row={ROW.S2} align="west" />

            <WireCell rowStart={ROW.G1} rowEnd={ROW.G2 + 1} yTop={16.67} yBottom={83.33} yOut={50} flip col={12} />
            <WireCell rowStart={ROW.G3} rowEnd={ROW.G4 + 1} yTop={16.67} yBottom={83.33} yOut={50} flip col={12} />

            {/* Western first round */}
            <MatchCell series={westR1[0]} col={13} row={ROW.G1} align="west" />
            <MatchCell series={westR1[1]} col={13} row={ROW.G2} align="west" />
            <MatchCell series={westR1[2]} col={13} row={ROW.G3} align="west" />
            <MatchCell series={westR1[3]} col={13} row={ROW.G4} align="west" />
          </div>

          <div className="nba-bracket-footer">
            <span className="nba-finals-champion">Champion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
