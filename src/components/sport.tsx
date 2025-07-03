'use client';

import React from 'react';
import { Photos, PhotoItem } from './photos';

const GamingLife = () => {
  // Placeholder URLs with text overlays; replace with real screenshots later
  const gamePhotos: PhotoItem[] = [
    {
      src: 'https://via.placeholder.com/400x400.png?text=Free+Fire+Victory',
      alt: 'Free Fire Victory Screen',
      caption: '"Drop. Loot. Get clapped. With friends, of course."'
    },
    {
      src: 'https://via.placeholder.com/400x400.png?text=Chess+Blunder',
      alt: 'Chess.com Blunder Screenshot',
      caption: '"I sacrificed my queen… for vibes."'
    },
    {
      src: 'https://via.placeholder.com/400x400.png?text=Valorant+Scoreboard',
      alt: 'Valorant Agent Selection',
      caption: '"Support main. MVP… in spirit."'
    },
    {
      src: 'https://via.placeholder.com/400x400.png?text=GTA+V+Chaos',
      alt: 'GTA V Chaos Moment',
      caption: '"Professional civilian disruptor."'
    },
    {
      src: 'https://via.placeholder.com/400x400.png?text=Fortnite+Panic+Build',
      alt: 'Fortnite Panic Building',
      caption: '"Zero build = 100% survival rate."'
    },
    {
      src: 'https://via.placeholder.com/400x400.png?text=CSGO+Bomb',
      alt: 'CS:GO Bomb Plant',
      caption: '"Plant the bomb. Forget the bomb… every time."'
    },
    {
      src: 'https://via.placeholder.com/400x400.png?text=Rocket+League+Miss',
      alt: 'Rocket League Missed Shot',
      caption: '"Calculated miss. Legendary fail."'
    },
    {
      src: 'https://via.placeholder.com/400x400.png?text=PUBG+Crawling',
      alt: 'PUBG Crawling Survivor',
      caption: '"Still looking for a helmet…"'
    }
  ];

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <div className="mb-8">
        <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
          My Gaming Journey
        </h2>
        <p className="mt-4 text-muted-foreground">
          I'm a casual-but-sometimes-sweaty gamer. Whether it’s chasing checkmates in Chess or being the last one to die in Free Fire, I’ve tried them all — mostly with friends (because solo queue is pain). Here’s a look at my <em>mostly average</em>, sometimes hilarious journey through the world of games.
        </p>
      </div>
      <Photos photos={gamePhotos} className="mb-16" />
    </div>
  );
};

export default GamingLife;
