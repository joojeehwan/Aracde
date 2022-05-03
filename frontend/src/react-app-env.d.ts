/// <reference types="react-scripts" />
declare module '@loadable/component';
declare module 'react-modal';
declare module 'sass';
declare module 'aos';
declare module 'lodash';
declare module '*.jpg';
declare module '*.png';
declare module 'sockjs-client/dist/sockjs';
declare module 'react-slick';
declare module '*.svg' {
  import React = require('react');

    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}
