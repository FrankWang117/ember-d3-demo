import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    keyForAttribute(key) { return key; }
});
