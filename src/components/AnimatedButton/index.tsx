import React from 'react';
import styled from 'styled-components';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';

interface AnimatedButtonProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  disclaimer?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  to, 
  href, 
  children, 
  disclaimer = "Secure your multisig today" 
}) => {
  const history = useHistory();
  const ButtonContent = () => (
    <StyledWrapper>
      <div className="btn-wrapper">
        <button className="btn">
          <span className="btn-txt">{children}</span>
          <div className="dot pulse" />
        </button>
        <span className="disclaimer-txt">{disclaimer}</span>
      </div>
    </StyledWrapper>
  );

  if (to) {
    return (
      <Link
        to={to}
        style={{ textDecoration: 'none' }}
        onClick={(e) => {
          try {
            e.preventDefault();
            document.body.classList.add('cg-leave');
            window.setTimeout(() => {
              history.push(to);
              window.setTimeout(() => {
                document.body.classList.remove('cg-leave');
              }, 250);
            }, 320);
          } catch (_err) {
            // fallback to default navigation
          }
        }}
      >
        <ButtonContent />
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
        <ButtonContent />
      </a>
    );
  }

  return <ButtonContent />;
};

const StyledWrapper = styled.div`
  .btn-wrapper {
    --width: 240px;
    --height: 64px;
    --padding: 8px;
    --border-radius: 24px;
    --dot-size: 10px;
    --btn-color: #0C0C0C;
    --hue: 16deg; /* FB3800 orange hue */
    --animation-duration: 1.2s;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    border-radius: var(--border-radius);
    border: none;

    background: linear-gradient(#ffffff10, #00000020), #0C0C0C;
    border: 1px solid rgba(255, 255, 255, 0.1);

    box-shadow:
      1px 1px 2px 0 #ffffff15,
      2px 2px 2px #FB380020 inset,
      2px 2px 4px #FB380015 inset,
      2px 2px 8px #FB380010 inset;

    transition: box-shadow 50ms linear;

    perspective: 150px;
    perspective-origin: center;

    user-select: none;
    z-index: 1;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 0.25em;
    text-align: left;
    padding: 0 var(--height) 0 calc(var(--padding) * 2);

    width: calc(100% - 2 * var(--padding));
    height: calc(100% - 2 * var(--padding));
    border-radius: calc(var(--border-radius) - var(--padding));
    border: none;
    cursor: pointer;

    background: linear-gradient(#ffffff10, #00000020), var(--btn-color);

    box-shadow:
      1px 1px 2px -1px #ffffff20 inset,
      0 2px 1px #00000010,
      0 4px 2px #00000010,
      0 8px 4px #00000010,
      0 16px 8px #00000010,
      0 32px 16px #00000010;

    transition:
      transform 0.25s cubic-bezier(0.25, 1.5, 0.5, 2.2),
      box-shadow 0.25s cubic-bezier(0.25, 1.5, 0.5, 1),
      filter 0.3s cubic-bezier(0.25, 1.5, 0.5, 1);
    will-change: transform, filter;

    z-index: 2;
  }

  .btn-txt {
    display: inline-block;

    font-size: 16px;
    font-weight: 600;
    font-family: 'Space Mono', "Montserrat", "Manrope", sans-serif;

    color: #DEDEDE;
    background-image: linear-gradient(#DEDEDE, #DEDEDE);
    background-clip: text;
    filter: drop-shadow(0 1px 0px #ffffff20) drop-shadow(0 -1px 0px #00000040);
  }

  .disclaimer-txt {
    position: absolute;
    left: var(--border-radius);
    bottom: -28px;
    font-family: 'Space Mono', "Montserrat", "Manrope", sans-serif;
    font-size: 11px;
    color: #DEDEDE80;
    text-shadow: 0 0 8px #ffffff30;
  }

  .dot {
    position: absolute;
    top: calc(50% - var(--dot-size) / 2);
    right: calc(var(--height) / 2 - var(--padding) / 2);
    width: var(--dot-size);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background-color: hsla(var(--hue), 50%, 50%, 0.3);

    border: 1px solid hsla(var(--hue), 80%, 60%, 0.6);
    box-sizing: border-box;

    box-shadow:
      1px 1px 2px -1px #ffffff20 inset,
      0 2px 1px #00000010,
      0 4px 2px #00000010,
      0 8px 4px #00000010;

    pointer-events: none;
    z-index: 3;
  }

  .dot::before {
    content: "";
    position: absolute;
    top: calc(var(--padding) / -2);
    left: calc(var(--padding) / -2);
    width: calc(100% + var(--padding));
    height: calc(100% + var(--padding));
    border-radius: inherit;
    background-color: #00000060;
    mask-image: radial-gradient(circle at 50% 60%, transparent 50%, black);
  }

  .dot::after {
    content: "";
    position: absolute;
    top: calc(var(--padding) / -2);
    left: calc(var(--padding) / -2);
    width: calc(100% + var(--padding));
    height: calc(100% + var(--padding));
    border-radius: inherit;
    background-color: #0000;

    box-shadow:
      0 0 10px 2px hsla(var(--hue), 80%, 50%, 0.4),
      0 0 20px 10px hsla(var(--hue), 80%, 50%, 0.6),
      0 0 50px 20px hsla(var(--hue), 80%, 50%, 0.4),
      0 0 16px 1px #FB3800 inset;

    opacity: 0;
  }

  .pulse {
    transition: transform 200ms ease-in;

    &.dot {
      animation: bg-anim var(--animation-duration) ease-in-out infinite;
    }

    &::after {
      animation: opacity-anim var(--animation-duration) ease-in-out infinite;
    }
  }

  @keyframes bg-anim {
    0%,
    100% {
      background-color: hsla(var(--hue), 50%, 50%, 0.2);
    }
    50% {
      background-color: #FB3800;
    }
  }

  @keyframes opacity-anim {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  .btn:hover,
  .btn:focus-visible {
    filter: drop-shadow(
      var(--padding) 0 var(--padding) hsla(var(--hue), 70%, 60%, 0.8)
    );
    transform: translate3d(0, -2px, 2px);

    .btn-txt {
      color: #FB3800;
      background-image: linear-gradient(#FB3800, #FB3800);
      text-shadow: 0 0 20px #FB380080;
    }

    .pulse {
      &.dot {
        animation: none;
        background-color: #FB3800;
      }
      &::after {
        animation: none;
        opacity: 1;
      }
    }
  }

  .btn:focus-visible {
    outline: 2px dashed #FB3800;
    outline-offset: var(--padding);
  }

  .btn:active {
    filter: drop-shadow(
      var(--padding) 0 var(--padding) #FB3800
    );
    transform: translate3d(0, 0, -4px);

    .btn-txt {
      color: #FB3800;
      background-image: linear-gradient(#FB3800, #FB3800);
    }

    ~ .dot {
      animation-play-state: paused;
      background-color: #FB3800;
    }
  }

  .btn-wrapper:has(.btn:active) {
    box-shadow:
      1px 1px 2px 0 #ffffff20,
      2px 2px 2px #FB380020 inset,
      2px 2px 4px #FB380015 inset,
      2px 2px 8px #FB380010 inset,
      0 0 32px 2px #FB380050 inset;
  }
`;

export default AnimatedButton;
