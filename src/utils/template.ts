
/* IMPORT */

import _ from 'lodash';

/* MAIN */

const Template = {

  /* API */

  getRegex: _.memoize ( ( token: string ): RegExp => {

    return new RegExp ( `\\[${_.escapeRegExp ( token )}\\]`, 'g' );

  }),

  render: ( template: string, tokens = {} ): string => {

    _.forOwn ( tokens, ( value: string, token: string ) => {

      const re = Template.getRegex ( token );

      template = template.replace ( re, value );

    });

    return template;

  }

};

/* EXPORT */

export default Template;
