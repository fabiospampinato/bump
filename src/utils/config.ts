
/* IMPORT */

import _ from 'lodash';

/* MAIN */

const Config = {

  /* API */

  merge: <T> ( target: T, other: any ): T => {

   return _.mergeWith ( target, other, ( prev, next ) => {

     if ( !_.isArray ( prev ) || !_.isArray ( next ) ) return;

     return next;

   });

 }

};

/* EXPORT */

export default Config;
