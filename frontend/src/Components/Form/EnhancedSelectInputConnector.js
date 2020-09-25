import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchOptions, clearOptions, defaultState } from 'Store/Actions/providerOptionActions';
import EnhancedSelectInput from './EnhancedSelectInput';

function getSelectOptions(items) {
  if (!items) {
    return [];
  }

  return items.map((option) => {
    return {
      key: option.value,
      value: option.name,
      hint: option.hint,
      parentKey: option.parentValue
    };
  });
}

function createMapStateToProps() {
  return createSelector(
    (state, { selectOptionsProviderAction }) => state.providerOptions[selectOptionsProviderAction] || defaultState,
    (options) => {
      if (options) {
        return {
          isFetching: options.isFetching,
          values: getSelectOptions(options.items)
        };
      }
    }
  );
}

const mapDispatchToProps = {
  dispatchFetchOptions: fetchOptions,
  dispatchClearOptions: clearOptions
};

class EnhancedSelectInputConnector extends Component {

  //
  // Lifecycle

  componentDidMount = () => {
    this._populate();
  }

  componentWillUnmount = () => {
    this._cleanup();
  }

  //
  // Control

  _populate() {
    const {
      isFetching,
      provider,
      providerData,
      selectOptionsProviderAction,
      dispatchFetchOptions
    } = this.props;

    if (selectOptionsProviderAction && !isFetching) {
      dispatchFetchOptions({
        section: selectOptionsProviderAction,
        action: selectOptionsProviderAction,
        provider,
        providerData
      });
    }
  }

  _cleanup() {
    const {
      selectOptionsProviderAction,
      dispatchClearOptions
    } = this.props;

    if (selectOptionsProviderAction) {
      dispatchClearOptions({ section: selectOptionsProviderAction });
    }
  }

  //
  // Render

  render() {
    return (
      <EnhancedSelectInput
        {...this.props}
      />
    );
  }
}

EnhancedSelectInputConnector.propTypes = {
  provider: PropTypes.string.isRequired,
  providerData: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptionsProviderAction: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatchFetchOptions: PropTypes.func.isRequired,
  dispatchClearOptions: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(EnhancedSelectInputConnector);
