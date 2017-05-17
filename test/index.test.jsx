/* eslint-env mocha */

import React from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { shallow } from 'enzyme'; // eslint-disable-line import/no-extraneous-dependencies

import Spinner from '../src/index.jsx';

describe('<Spinner />', () => {
  it('should override `spinner` className', () => {
    const wrapper = shallow(<Spinner overrideSpinnerClassName="sk-custom-spinner" />);

    expect(wrapper.find('div.sk-spinner').length).to.equal(0);
    expect(wrapper.find('div.sk-custom-spinner').length).to.equal(1);
  });

  describe('fadeIn behavior', () => {
    it('should apply `sk-fade-in` class by default', () => {
      const wrapper = shallow(<Spinner />);

      expect(wrapper.find('div.sk-fade-in').length).to.equal(1);
      expect(wrapper.find('div.sk-fade-in-half-second').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-quarter-second').length).to.equal(0);
    });

    it('should apply `sk-fade-in-half-second` class when `fadeIn` set to `half`', () => {
      const wrapper = shallow(<Spinner fadeIn="half" />);

      expect(wrapper.find('div.sk-fade-in').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-half-second').length).to.equal(1);
      expect(wrapper.find('div.sk-fade-in-quarter-second').length).to.equal(0);
    });

    it('should apply `sk-fade-in-quarter-second` class when `fadeIn` set to `quarter`', () => {
      const wrapper = shallow(<Spinner fadeIn="quarter" />);

      expect(wrapper.find('div.sk-fade-in').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-half-second').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-quarter-second').length).to.equal(1);
    });

    it('should not apply any fadeIn classes when `fadeIn` set to `none`', () => {
      const wrapper = shallow(<Spinner fadeIn="none" />);

      expect(wrapper.find('div.sk-fade-in').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-half-second').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-quarter-second').length).to.equal(0);
    });

    it('should not apply any fadeIn classes when `noFadeIn` set (deprecated)', () => {
      const wrapper = shallow(<Spinner noFadeIn />);

      expect(wrapper.find('div.sk-fade-in').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-half-second').length).to.equal(0);
      expect(wrapper.find('div.sk-fade-in-quarter-second').length).to.equal(0);
    });
  });

  describe('native spinner tests', () => {
    it('should render double-bounce spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="double-bounce" />);

      expect(wrapper.find('div.sk-double-bounce').length).to.equal(1);
      expect(wrapper.find('div.sk-double-bounce1').length).to.equal(1);
      expect(wrapper.find('div.sk-double-bounce2').length).to.equal(1);
    });

    it('should render rotating-plane spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="rotating-plane" />);

      expect(wrapper.find('div.sk-rotating-plane').length).to.equal(1);
    });

    it('should render wave spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="wave" />);

      expect(wrapper.find('div.sk-wave').length).to.equal(1);
      expect(wrapper.find('div.sk-rect1').length).to.equal(1);
      expect(wrapper.find('div.sk-rect2').length).to.equal(1);
      expect(wrapper.find('div.sk-rect3').length).to.equal(1);
      expect(wrapper.find('div.sk-rect4').length).to.equal(1);
      expect(wrapper.find('div.sk-rect5').length).to.equal(1);
    });

    it('should render wandering-cubes spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="wandering-cubes" />);

      expect(wrapper.find('div.sk-wandering-cubes').length).to.equal(1);
      expect(wrapper.find('div.sk-cube1').length).to.equal(1);
      expect(wrapper.find('div.sk-cube2').length).to.equal(1);
    });

    it('should render pulse spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="pulse" />);

      expect(wrapper.find('div.sk-pulse').length).to.equal(1);
    });

    it('should render chasing-dots spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="chasing-dots" />);

      expect(wrapper.find('div.sk-chasing-dots').length).to.equal(1);
      expect(wrapper.find('div.sk-dot1').length).to.equal(1);
      expect(wrapper.find('div.sk-dot2').length).to.equal(1);
    });

    it('should render circle spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="circle" />);

      expect(wrapper.find('div.sk-circle-wrapper').length).to.equal(1);
      expect(wrapper.find('div.sk-circle').length).to.equal(12);
    });

    it('should render cube-grid spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="cube-grid" />);

      expect(wrapper.find('div.sk-cube-grid').length).to.equal(1);
      expect(wrapper.find('div.sk-cube').length).to.equal(9);
    });

    it('should render folding-cube spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="folding-cube" />);

      expect(wrapper.find('div.sk-folding-cube').length).to.equal(1);
      expect(wrapper.find('div.sk-cube').length).to.equal(4);
    });

    it('should render wordpress spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="wordpress" />);

      expect(wrapper.find('div.sk-wordpress').length).to.equal(1);
      expect(wrapper.find('div.sk-inner-circle').length).to.equal(1);
    });

    it('should render three-bounce spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="three-bounce" />);

      expect(wrapper.find('div.sk-three-bounce').length).to.equal(1);
      expect(wrapper.find('div.sk-bounce1').length).to.equal(1);
      expect(wrapper.find('div.sk-bounce2').length).to.equal(1);
      expect(wrapper.find('div.sk-bounce3').length).to.equal(1);
    });
  });

  describe('loaders.css spinner tests', () => {
    it('should render a 9-div simple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-grid-pulse" />);

      expect(wrapper.hasClass('ball-grid-pulse')).to.equal(true);
      expect(wrapper.children().length).to.equal(9);
    });

    it('should render an 8-div simple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="line-spin-fade-loader" />);

      expect(wrapper.hasClass('line-spin-fade-loader')).to.equal(true);
      expect(wrapper.children().length).to.equal(8);
    });

    it('should render a 5-div simple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-pulse-rise" />);

      expect(wrapper.hasClass('ball-pulse-rise')).to.equal(true);
      expect(wrapper.children().length).to.equal(5);
    });

    it('should render a 4-div simple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="line-scale-party" />);

      expect(wrapper.hasClass('line-scale-party')).to.equal(true);
      expect(wrapper.children().length).to.equal(4);
    });

    it('should render a 3-div simple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-pulse-sync" />);

      expect(wrapper.hasClass('ball-pulse-sync')).to.equal(true);
      expect(wrapper.children().length).to.equal(3);
    });

    it('should render a 3-div extra-style spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-triangle-path" />);

      expect(wrapper.hasClass('ball-triangle-path')).to.equal(true);
      expect(wrapper.children().length).to.equal(3);
    });

    it('should render a 2-div simple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-zig-zag" />);

      expect(wrapper.hasClass('ball-zig-zag')).to.equal(true);
      expect(wrapper.children().length).to.equal(2);
    });

    it('should render a ball-clip-rotate spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-clip-rotate" />);

      expect(wrapper.hasClass('ball-clip-rotate')).to.equal(true);
      expect(wrapper.children().length).to.equal(1);
    });

    it('should render a ball-clip-rotate-pulse spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-clip-rotate-pulse" />);

      expect(wrapper.hasClass('ball-clip-rotate-pulse')).to.equal(true);
      expect(wrapper.children().length).to.equal(2);
    });

    it('should render a ball-clip-rotate-multiple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-clip-rotate-multiple" />);

      expect(wrapper.hasClass('ball-clip-rotate-multiple')).to.equal(true);
      expect(wrapper.children().length).to.equal(2);
    });

    it('should render a ball-scale-ripple spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="ball-scale-ripple" />);

      expect(wrapper.hasClass('ball-scale-ripple')).to.equal(true);
      expect(wrapper.children().length).to.equal(1);
    });

    it('should render a triangle-skew-spin spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="triangle-skew-spin" />);

      expect(wrapper.hasClass('triangle-skew-spin')).to.equal(true);
      expect(wrapper.children().length).to.equal(1);
    });

    it('should render a pacman spinner', () => {
      const wrapper = shallow(<Spinner spinnerName="pacman" />);

      expect(wrapper.hasClass('pacman')).to.equal(true);
      expect(wrapper.children().length).to.equal(5);
    });
  });
});
