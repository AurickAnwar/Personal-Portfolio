import React from 'react';
import {
  worldCupKnockout,
  worldCupFlags,
  worldCupPicks,
} from '../../data/lifeContent';
import './WorldCupBracket.css';

function deriveNext(matches, picks, prefix) {
  const out = [];
  for (let i = 0; i < matches.length; i += 2) {
    out.push({
      id: `${prefix}-${i / 2}`,
      a: picks[matches[i].id] || null,
      b: picks[matches[i + 1].id] || null,
    });
  }
  return out;
}

function buildBracket(picks) {
  const l32 = worldCupKnockout.left;
  const l16 = deriveNext(l32, picks, 'l16');
  const lqf = deriveNext(l16, picks, 'lqf');
  const lsf = deriveNext(lqf, picks, 'lsf');

  const r32 = worldCupKnockout.right;
  const r16 = deriveNext(r32, picks, 'r16');
  const rqf = deriveNext(r16, picks, 'rqf');
  const rsf = deriveNext(rqf, picks, 'rsf');

  const final = {
    id: 'final',
    a: picks['lsf-0'] || null,
    b: picks['rsf-0'] || null,
  };

  return { l32, l16, lqf, lsf, r32, r16, rqf, rsf, final };
}

function flagCode(team) {
  return team ? worldCupFlags[team] || null : null;
}

function Flag({ team }) {
  const code = flagCode(team);
  if (!code) {
    return <span className="wc-team-flag wc-team-flag--empty" aria-hidden>·</span>;
  }
  return (
    <img
      className="wc-team-flag"
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width="22"
      height="16"
      loading="lazy"
      alt=""
      aria-hidden
    />
  );
}

function TeamRow({ team, picked }) {
  const isEmpty = !team;
  const classes = [
    'wc-team',
    picked ? 'wc-team--picked' : '',
    isEmpty ? 'wc-team--empty' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} title={team || 'To be decided'}>
      <Flag team={team} />
      <span className="wc-team-name">{team || 'TBD'}</span>
    </div>
  );
}

function MatchCard({ match, pick, highlight }) {
  const classes = ['wc-match', highlight ? 'wc-match--final' : ''].filter(Boolean).join(' ');

  return (
    <div className="wc-match-slot">
      <div className={classes}>
        <TeamRow team={match.a} picked={match.a && pick === match.a} />
        <TeamRow team={match.b} picked={match.b && pick === match.b} />
      </div>
    </div>
  );
}

function RoundColumn({ label, matches, picks }) {
  return (
    <div className="wc-round">
      <div className="wc-round-label">{label}</div>
      <div className="wc-round-body">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} pick={picks[m.id] || null} />
        ))}
      </div>
    </div>
  );
}

export default function WorldCupBracket() {
  const picks = worldCupPicks;
  const bracket = buildBracket(picks);
  const champion = picks.final || null;

  return (
    <div className="wc-bracket-shell">
      <div className="wc-bracket-top">
        <div>
          <p className="wc-bracket-kicker">World Cup 2026 — my knockout predictions</p>
          <p className="wc-bracket-sub">
            My call for every match. The winner of each one advances all the way to the final.
          </p>
        </div>
        <div className="wc-bracket-meta">
          <span className="wc-bracket-progress">
            {champion ? (
              <>
                <Flag team={champion} /> {champion} to win it all
              </>
            ) : (
              'Champion TBD'
            )}
          </span>
        </div>
      </div>

      <div className="wc-bracket-scroll">
        <div className="wc-bracket-arena">
          <div className="wc-bracket-row">
            <div className="wc-half wc-half--left">
              <RoundColumn label="Round of 32" matches={bracket.l32} picks={picks} />
              <RoundColumn label="Round of 16" matches={bracket.l16} picks={picks} />
              <RoundColumn label="Quarterfinals" matches={bracket.lqf} picks={picks} />
              <RoundColumn label="Semifinal" matches={bracket.lsf} picks={picks} />
            </div>

            <div className="wc-final-col">
              <div className="wc-round wc-round--final">
                <div className="wc-round-label wc-round-label--final">Final</div>
                <div className="wc-round-body">
                  <MatchCard match={bracket.final} pick={picks.final || null} highlight />
                </div>
              </div>
              <div className={`wc-champion ${champion ? 'wc-champion--set' : ''}`}>
                <span className="wc-champion-label">Champion</span>
                <span className="wc-champion-name">
                  {champion ? (
                    <>
                      <Flag team={champion} /> {champion}
                    </>
                  ) : (
                    'TBD'
                  )}
                </span>
              </div>
            </div>

            <div className="wc-half wc-half--right">
              <RoundColumn label="Semifinal" matches={bracket.rsf} picks={picks} />
              <RoundColumn label="Quarterfinals" matches={bracket.rqf} picks={picks} />
              <RoundColumn label="Round of 16" matches={bracket.r16} picks={picks} />
              <RoundColumn label="Round of 32" matches={bracket.r32} picks={picks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
