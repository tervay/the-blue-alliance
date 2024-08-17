import { Link } from '@remix-run/react';

import LogosFacebook from '~icons/logos/facebook';
import LogosGithubIcon from '~icons/logos/github-icon';
import LogosGitlab from '~icons/logos/gitlab';
import LogosInstagramIcon from '~icons/logos/instagram-icon';
import LogosYoutubeIcon from '~icons/logos/youtube-icon';
import SimpleIconsX from '~icons/simple-icons/x';

import { Media } from '~/api/v3';
import InlineIcon from '~/components/tba/inlineIcon';
import { badgeVariants } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

function SingleSocialIcon({
  media,
  className,
}: {
  media: Media;
  className: string;
}) {
  if (media.type === 'youtube' || media.type === 'youtube-channel') {
    return (
      <Link
        to={`https://www.youtube.com/${media.foreign_key}`}
        className={className}
      >
        <InlineIcon>
          <LogosYoutubeIcon />
          {media.foreign_key}
        </InlineIcon>
      </Link>
    );
  }

  if (media.type === 'facebook-profile') {
    return (
      <Link
        to={`https://www.facebook.com/${media.foreign_key}`}
        className={className}
      >
        <InlineIcon>
          <LogosFacebook />
          {media.foreign_key}
        </InlineIcon>
      </Link>
    );
  }

  if (media.type === 'github-profile') {
    return (
      <Link
        to={`https://github.com/${media.foreign_key}`}
        className={className}
      >
        <InlineIcon>
          <LogosGithubIcon />
          {media.foreign_key}
        </InlineIcon>
      </Link>
    );
  }

  if (media.type === 'instagram-profile') {
    return (
      <Link
        to={`https://www.instagram.com/${media.foreign_key}`}
        className={className}
      >
        <InlineIcon>
          <LogosInstagramIcon />
          {media.foreign_key}
        </InlineIcon>
      </Link>
    );
  }

  if (media.type === 'twitter-profile') {
    return (
      <Link to={`https://x.com/${media.foreign_key}`} className={className}>
        <InlineIcon>
          <SimpleIconsX />
          {media.foreign_key}
        </InlineIcon>
      </Link>
    );
  }

  if (media.type === 'gitlab-profile') {
    return (
      <Link
        to={`https://gitlab.com/${media.foreign_key}`}
        className={className}
      >
        <InlineIcon>
          <LogosGitlab />
          {media.foreign_key}
        </InlineIcon>
      </Link>
    );
  }

  return null;
}

export default function TeamSocialMediaList({ socials }: { socials: Media[] }) {
  socials.sort((a, b) => a.type.localeCompare(b.type));

  return (
    <>
      {socials.map((m) => (
        <SingleSocialIcon
          media={m}
          key={`${m.type}-${m.foreign_key}`}
          className={cn(badgeVariants({ variant: 'secondary' }), 'm-0.5')}
        />
      ))}
    </>
  );
}
