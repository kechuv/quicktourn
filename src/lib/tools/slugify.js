import { kebabCase } from 'lodash-es';

/** @param {string} text */
const slugify = text => kebabCase(text);

export default slugify;
