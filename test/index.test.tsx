import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { cleanup, render } from '@testing-library/react';

import Spinner from '../src/index';
import UnstyledSpinner from '../src/unstyled';
import { spinkitSpinners, loadersCssSpinners, type SpinnerName } from '../src/spinners';

type TestProps = Spinner.SpinnerProps & { 'data-testid'?: string };

const fadeInClasses = ['sk-fade-in', 'sk-fade-in-half-second', 'sk-fade-in-quarter-second'];

function renderSpinner(props: TestProps = {}): HTMLElement {
  const { container } = render(<Spinner {...props} />);
  return container.firstChild as HTMLElement;
}

function activeFadeInClasses(el: HTMLElement) {
  return fadeInClasses.filter((c) => el.classList.contains(c));
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('<Spinner />', () => {
  describe('custom classes', () => {
    it('should override `sk-spinner` class when overrideSpinnerClassName is set', () => {
      const el = renderSpinner({ overrideSpinnerClassName: 'sk-custom-spinner' });

      expect(el.classList.contains('sk-spinner')).toBe(false);
      expect(el.classList.contains('sk-custom-spinner')).toBe(true);
    });

    it('should add extra class when className is set', () => {
      const el = renderSpinner({ className: 'sk-custom-spinner' });

      expect(el.classList.contains('sk-spinner')).toBe(true);
      expect(el.classList.contains('sk-custom-spinner')).toBe(true);
    });
  });

  describe('fadeIn behavior', () => {
    it('should apply `sk-fade-in` class by default', () => {
      expect(activeFadeInClasses(renderSpinner())).toEqual(['sk-fade-in']);
    });

    it('should apply `sk-fade-in-half-second` class when `fadeIn` set to `half`', () => {
      expect(activeFadeInClasses(renderSpinner({ fadeIn: 'half' }))).toEqual([
        'sk-fade-in-half-second',
      ]);
    });

    it('should apply `sk-fade-in-quarter-second` class when `fadeIn` set to `quarter`', () => {
      expect(activeFadeInClasses(renderSpinner({ fadeIn: 'quarter' }))).toEqual([
        'sk-fade-in-quarter-second',
      ]);
    });

    it('should not apply any fadeIn classes when `fadeIn` set to `none`', () => {
      expect(activeFadeInClasses(renderSpinner({ fadeIn: 'none' }))).toEqual([]);
    });

    it('should not apply any fadeIn classes when `noFadeIn` set (deprecated)', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(activeFadeInClasses(renderSpinner({ noFadeIn: true }))).toEqual([]);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('noFadeIn'));
    });
  });

  describe('color and pass-through props', () => {
    it('should set the color style and keep existing styles', () => {
      const el = renderSpinner({ color: 'red', style: { margin: '4px' } });

      expect(el.style.color).toBe('red');
      expect(el.style.margin).toBe('4px');
    });

    it('should pass unknown props through to the outer div', () => {
      const el = renderSpinner({ 'data-testid': 'spinner', 'aria-label': 'Loading' });

      expect(el.getAttribute('data-testid')).toBe('spinner');
      expect(el.getAttribute('aria-label')).toBe('Loading');
    });

    it('should not leak spinner-specific props to the DOM', () => {
      const el = renderSpinner({ name: 'circle', fadeIn: 'half' });

      expect(el.hasAttribute('name')).toBe(false);
      expect(el.hasAttribute('fadein')).toBe(false);
    });
  });

  it('should fall back to three-bounce for an unknown name', () => {
    // @ts-expect-error -- `name` only accepts known spinner names
    const el = renderSpinner({ name: 'not-a-spinner' });

    expect(el.classList.contains('sk-three-bounce')).toBe(true);
    expect(el.children.length).toBe(spinkitSpinners['three-bounce'].divCount);
  });

  it('should not accept children in its props type', () => {
    // @ts-expect-error -- the spinner renders its own child divs
    const el = renderSpinner({ children: 'Loading…' });
    // @ts-expect-error -- React refuses dangerouslySetInnerHTML beside the spinner's children
    const props: TestProps = { dangerouslySetInnerHTML: { __html: 'x' } };

    expect(el.textContent).toBe('');
    expect(props).toBeDefined();
  });

  it('should export the same component from the unstyled entry point', () => {
    expect(UnstyledSpinner).toBe(Spinner);
  });

  describe('spinkit spinners', () => {
    Object.entries(spinkitSpinners).forEach(([spinner, spinnerInfo]) => {
      it(`should render ${spinner} spinner`, () => {
        const el = renderSpinner({ name: spinner as SpinnerName });

        expect(el.classList.contains(spinnerInfo.className)).toBe(true);
        expect(el.children.length).toBe(spinnerInfo.divCount);
      });
    });
  });

  describe('loaders.css spinners', () => {
    Object.entries(loadersCssSpinners).forEach(([spinner, spinnerInfo]) => {
      it(`should render ${spinner} spinner`, () => {
        const el = renderSpinner({ name: spinner as SpinnerName });

        expect(el.classList.contains(spinner)).toBe(true);
        expect(el.children.length).toBe(spinnerInfo.divCount);
      });
    });
  });
});
