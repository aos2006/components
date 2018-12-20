import _ from 'lodash';
import { action, computed, observable } from 'mobx';

export type IBreakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type IBreakpointMap = Partial<Record<IBreakpoint, number>>;
export type IDirections = 'only' | 'less' | 'more';
export type IBreakpointAbstract = IBreakpoint | IDirections | number;

class ReStore {
  responsiveArray: IBreakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  responsiveMap: IBreakpointMap = {
    xs: 375,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  };
  @observable innerWidth: number;

  @observable xs: boolean;
  @observable sm: boolean;
  @observable md: boolean;
  @observable lg: boolean;
  @observable xl: boolean;
  @observable xxl: boolean;

  @observable xs_less: boolean;
  @observable sm_less: boolean;
  @observable md_less: boolean;
  @observable lg_less: boolean;
  @observable xl_less: boolean;
  @observable xxl_less: boolean;

  @observable xs_only: boolean;
  @observable sm_only: boolean;
  @observable md_only: boolean;
  @observable lg_only: boolean;
  @observable xl_only: boolean;
  @observable xxl_only: boolean;

  @computed
  get isMobile() {
    return this.md_less;
  }

  get isMobileS() {
    return this.xs_less;
  }

  constructor() {
    this.setInnerWidth();
    setInterval(this.setInnerWidth, 360);
  }

  isBreakpoint(point: any): point is IBreakpoint {
    return this.responsiveArray.indexOf(point) !== -1;
  }

  @action.bound
  setInnerWidth() {
    if (window && window.innerWidth !== this.innerWidth) {
      this.innerWidth = window.innerWidth;
      this.setPints();
    }
  }

  @action.bound
  setPints(): any {
    for (let i = 0; i < this.responsiveArray.length; i++) {
      const point = this.responsiveArray[i];

      /// ======================  Normal  ======================
      const resultNormal = this.pointToNumber(point);

      if (resultNormal <= this.innerWidth) {
        this[point] = true;
      } else {
        this[point] = false;
      }
      // ======================  END Normal  ======================

      /// ======================  Less  ======================
      const resultLess = this.pointToNumber(point);

      if (resultLess > this.innerWidth) {
        this[point + '_less'] = true;
      } else {
        this[point + '_less'] = false;
      }
      // ======================  END Less  ======================

      /// ======================  Only  ======================
      const resultOnly = this.getQuery(point, 'only');

      if (resultOnly.minWidth <= this.innerWidth && resultOnly.maxWidth >= this.innerWidth) {
        this[point + '_only'] = true;
      } else {
        this[point + '_only'] = false;
      }
      // ======================  END Only  ======================
    }
  }

  getSize(name: IBreakpoint): number {
    return this.responsiveMap[name];
  }

  getQuery(
    form: IBreakpointAbstract,
    to: IBreakpointAbstract
  ): { maxWidth?: number; minWidth?: number } {
    const range = [
      this.pointToNumber(form, to) - (to === 'only' || to === 'less' ? 1 : 0),
      this.pointToNumber(to, form) - (form === 'only' || form === 'less' ? 1 : 0),
    ];

    return {
      maxWidth: Math.max(...range),
      minWidth: Math.min(...range),
    };
  }

  pointToNumber(point: IBreakpointAbstract, otherPoint?: IBreakpointAbstract): number {
    if (_.isNumber(point)) {
      return point;
    }
    if ('less' === point) {
      return 0;
    } else if ('more' === point) {
      return Number.MAX_SAFE_INTEGER;
    } else if ('only' === point) {
      if (!this.isBreakpoint(otherPoint)) {
        throw Error("Only one point can be 'only'");
      } else {
        const indexPoint = this.responsiveArray.indexOf(otherPoint);

        const prevPoint = this.responsiveArray[indexPoint + 1];

        return prevPoint ? this.getSize(prevPoint) : 0;
      }
    } else {
      this.isBreakpoint(otherPoint);
    }
    {
      return this.getSize(point);
    }
  }
}

export default new ReStore();
