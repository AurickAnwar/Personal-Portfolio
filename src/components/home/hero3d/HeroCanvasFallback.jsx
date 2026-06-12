import React from 'react';
import heroArt from '../../../assets/aurick-hero.png';
import profilePhoto from '../../../assets/profilePhoto';
import { isLite3DDevice } from '../../../utils/device3d';

/** Static hero when WebGL / GLB load fails. Mobile uses the circular profile portrait. */
export default function HeroCanvasFallback({ useProfile }) {
  const showProfile = useProfile ?? isLite3DDevice();

  if (showProfile) {
    return (
      <div className="batman-hero__profile-fallback" aria-hidden="true">
        <img
          src={profilePhoto}
          alt="Aurick Anwar"
          className="batman-hero__profile-photo"
        />
      </div>
    );
  }

  return (
    <img
      src={heroArt}
      alt="Aurick in tactical armored suit"
      className="batman-hero__img-fallback"
    />
  );
}
