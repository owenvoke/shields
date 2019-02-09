'use strict'

const label = 'PGP'
const { BaseJsonService } = require('..')

const Joi = require('joi')
const schema = Joi.object({
  them: Joi.array().items(
    Joi.object({
      public_keys: Joi.object({
        primary: Joi.object({
          key_fingerprint: Joi.string().required(),
        }).required(),
      }).required(),
    }).required()
  ),
}).required()

const convertFingerprintTo64bit = fingerprint =>
  fingerprint
    .slice(-16)
    .toUpperCase()
    .match(/.{1,4}/g)
    .join(' ')

module.exports = class KeybasePGP extends BaseJsonService {
  static get category() {
    return 'other'
  }

  static get route() {
    return {
      base: 'keybase/pgp',
      pattern: ':username',
    }
  }

  static get examples() {
    return [
      {
        title: 'Keybase PGP',
        namedParams: { username: 'pxgamer' },
        staticPreview: this.render({ key: 'pxgamer' }),
        keywords: ['security'],
      },
    ]
  }

  async fetch({ username }) {
    return this._requestJson({
      schema,
      url: `https://keybase.io/_/api/1.0/user/lookup.json`,
      options: { qs: { fields: 'public_keys', usernames: username } },
    })
  }

  async handle({ username }) {
    const { them } = await this.fetch({ username })

    const fingerprint = them[0].public_keys.primary.key_fingerprint

    const key = convertFingerprintTo64bit(fingerprint)
    return this.constructor.render({ key })
  }

  static render({ key }) {
    return { message: key, label, color: 'blue' }
  }
}
