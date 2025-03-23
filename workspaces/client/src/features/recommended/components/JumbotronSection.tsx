import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import invariant from 'tiny-invariant';
import { ArrayValues } from 'type-fest';

import { Player } from '../../player/components/Player';
import { PlayerType } from '../../player/constants/player_type';
import { PlayerWrapper } from '../../player/interfaces/player_wrapper';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

// 説明文のスケルトンコンポーネント
const DescriptionSkeleton = () => (
  <div className="w-full text-center">
    <div className="mx-auto h-[14px] w-3/4 rounded bg-[#2a2a2a] animate-pulse mb-[8px]"></div>
    <div className="mx-auto h-[14px] w-2/3 rounded bg-[#2a2a2a] animate-pulse mb-[8px]"></div>
    <div className="mx-auto h-[14px] w-1/2 rounded bg-[#2a2a2a] animate-pulse"></div>
  </div>
);

export const JumbotronSection = ({ module }: Props) => {
  const playerRef = useRef<PlayerWrapper>(null);
  const store = useStore((s) => s);
  const episodeInfo = module.items[0]?.episodeInfo;
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [isLoadingFullData, setIsLoadingFullData] = useState(false);
  const episodeId = episodeInfo?.id;

  invariant(episodeInfo);

  // 完全なエピソードデータがストアに既に存在するかチェック
  const fullEpisodeDataFromStore = episodeId ? store.features.episode.episodes[episodeId] : null;

  // 説明文を表示するための関数
  const handleShowDescription = async () => {
    setDescriptionVisible(true);
    
    if (!fullEpisodeDataFromStore && episodeId && !isLoadingFullData) {
      try {
        setIsLoadingFullData(true);
        // ユーザーが説明文を見たいときだけ完全なデータを取得
        await store.features.episode.fetchEpisodeById({ episodeId });
      } catch (error) {
        console.error('Error fetching full episode data:', error);
      } finally {
        setIsLoadingFullData(false);
      }
    }
  };

  // マウスが離れたときに説明文の表示を非表示に
  const handleHideDescription = () => {
    setDescriptionVisible(false);
  };

  // 表示するためのエピソードデータ - ストアに完全データがあればそれを使用、なければ軽量バージョンを使用
  const episode = fullEpisodeDataFromStore || episodeInfo;

  return (
    <Hoverable classNames={{ hovered: 'opacity-50' }}>
      <NavLink
        viewTransition
        className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]"
        to={`/episodes/${episodeInfo.id}`}
        onMouseEnter={handleShowDescription}
        onMouseLeave={handleHideDescription}
      >
        {({ isTransitioning }) => {
          return (
            <>
              <div className="grow-1 shrink-1 p-[24px]">
                <div className="mb-[16px] w-full text-center text-[22px] font-bold text-[#ffffff]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
                </div>
                
                {/* 説明文の表示 - ローディング中はスケルトン、データがあれば実際の説明文 */}
                {descriptionVisible && (
                  isLoadingFullData ? (
                    <DescriptionSkeleton />
                  ) : fullEpisodeDataFromStore ? (
                    <div className="w-full text-center text-[14px] font-bold text-[#ffffff]">
                      <Ellipsis ellipsis reflowOnResize maxLine={3} text={fullEpisodeDataFromStore.description} visibleLine={3} />
                    </div>
                  ) : null
                )}
              </div>
              <Flipped stagger flipId={isTransitioning ? `episode-${episodeInfo.id}` : 0}>
                <div className="h-full w-auto shrink-0 grow-0">
                  <Player
                    loop
                    className="size-full"
                    playerRef={playerRef}
                    playerType={PlayerType.ShakaPlayer}
                    playlistUrl={`/streams/episode/${episodeInfo.id}/playlist.m3u8`}
                  />
                </div>
              </Flipped>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};
