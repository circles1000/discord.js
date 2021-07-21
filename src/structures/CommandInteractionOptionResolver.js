'use strict';

const { TypeError } = require('../errors');

/**
 * A resolver for command interaction options.
 */
class CommandInteractionOptionResolver {
  constructor(client, options) {
    /**
     * The client that instantiated this.
     * @name CommandInteractionOptionResolver#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The interaction options array.
     * @type {CommandInteractionOption[]}
     * @private
     */
    this._options = options ?? [];

    /**
     * The name of the sub-command group.
     * @type {?string}
     * @private
     */
    this._group = null;

    /**
     * The name of the sub-command.
     * @type {?string}
     * @private
     */
    this._subCommand = null;
    if (this._options[0]?.type === 'SUB_COMMAND_GROUP') {
      this._group = this._options[0].name;
      this._options = this._options[0].options ?? [];
    }
    if (this._options[0]?.type === 'SUB_COMMAND') {
      this._subCommand = this._options[0].name;
      this._options = this._options[0].options ?? [];
    }
  }

  /**
   * Gets an option by its name.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   */
  get(name, required = false) {
    const option = this._options.find(opt => opt.name === name);
    if (!option) {
      if (required) {
        throw new TypeError('COMMAND_INTERACTION_OPTION_NOT_FOUND', name);
      }
      return null;
    }
    return option;
  }

  /**
   * Gets an option by name and property and checks its type.
   * @param {string} name The name of the option.
   * @param {ApplicationCommandOptionType} type The type of the option.
   * @param {string[]} properties The properties to check for for `required`.
   * @param {boolean} required Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   * @private
   */
  _getTypedOption(name, type, properties, required) {
    const option = this.get(name, required);
    if (!option) {
      return null;
    } else if (option.type !== type) {
      throw new TypeError('COMMAND_INTERACTION_OPTION_TYPE', name, option.type, type);
    } else if (required && properties.every(prop => option[prop] === null || typeof option[prop] === 'undefined')) {
      throw new TypeError('COMMAND_INTERACTION_OPTION_EMPTY', name, option.type);
    }
    return option;
  }

  /**
   * Gets the selected sub-command.
   * @returns {string} The name of the selected sub-command.
   */
  getSubCommand() {
    if (!this._subCommand) {
      throw new TypeError('COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND');
    }
    return this._subCommand;
  }

  /**
   * Gets the selected sub-command group.
   * @returns {string} The name of the selected sub-command group.
   */
  getSubCommandGroup() {
    if (!this._group) {
      throw new TypeError('COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND_GROUP');
    }
    return this._group;
  }

  /**
   * Gets a boolean option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?boolean} The value of the option, or null if not set and not required.
   */
  getBoolean(name, required = false) {
    const option = this._getTypedOption(name, 'BOOLEAN', ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a channel option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(GuildChannel|APIInteractionDataResolvedChannel)}
   * The value of the option, or null if not set and not required.
   */
  getChannel(name, required = false) {
    const option = this._getTypedOption(name, 'CHANNEL', ['channel'], required);
    return option?.channel ?? null;
  }

  /**
   * Gets a string option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?string} The value of the option, or null if not set and not required.
   */
  getString(name, required = false) {
    const option = this._getTypedOption(name, 'STRING', ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets an integer option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getInteger(name, required = false) {
    const option = this._getTypedOption(name, 'INTEGER', ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a user option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?User} The value of the option, or null if not set and not required.
   */
  getUser(name, required = false) {
    const option = this._getTypedOption(name, 'USER', ['user'], required);
    return option?.user ?? null;
  }

  /**
   * Gets a member option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(GuildMember|APIInteractionDataResolvedGuildMember)}
   * The value of the option, or null if not set and not required.
   */
  getMember(name, required = false) {
    const option = this._getTypedOption(name, 'USER', ['member'], required);
    return option?.member ?? null;
  }

  /**
   * Gets a role option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(Role|APIRole)} The value of the option, or null if not set and not required.
   */
  getRole(name, required = false) {
    const option = this._getTypedOption(name, 'ROLE', ['role'], required);
    return option?.role ?? null;
  }

  /**
   * Gets a mentionable option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(User|GuildMember|APIInteractionDataResolvedGuildMember|Role|APIRole)}
   * The value of the option, or null if not set and not required.
   */
  getMentionable(name, required = false) {
    const option = this._getTypedOption(name, 'MENTIONABLE', ['user', 'member', 'role'], required);
    return option?.member ?? option?.user ?? option?.role ?? null;
  }
}

module.exports = CommandInteractionOptionResolver;
