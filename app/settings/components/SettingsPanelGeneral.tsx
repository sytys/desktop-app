import { ThemeTypes as Theme } from '@getstation/theme';
import { remote } from 'electron';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openProcessManager } from '../../app/duck';
import { areBetaIncludedInUpdates, getDownloadFolder } from '../../app/selectors';
import { clickBrowseDownloadFolder, revealPathInFinder } from '../../downloads/duck';
import { StationState } from '../../types';
import SettingsAutoLaunch from './SettingsAutoLaunch/SettingsAutoLaunch';
import SettingsDeveloperTools from './SettingsDeveloperTools';
import SettingsDownloadFolder from './SettingsDownloads/SettingsDownloadFolder';
import SettingsUpdatesButton from './SettingsUpdatesButton/SettingsUpdatesButton';

export interface Classes {
  container: string,
  header: string,
  thin: string,
  separator: string,
}

export interface StateProps {
  classes?: Classes,
  downloadFolder?: string,
}

export interface DispatchProps {
  clickBrowseDownloadFolder: () => void,
  revealPathInFinder: (path?: string) => void,
  openProcessManager: () => void,
}

export interface MergeProps {
  onDownloadLocationClick: () => void,
}

type OwnProps = {};

type Props = OwnProps & StateProps & DispatchProps & MergeProps;

const styles = (theme: Theme) => ({
  container: {
  },
  header: {
    ...theme.titles.h2,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  thin: {
    marginLeft: 3,
    fontWeight: 400,
    opacity: 0.5,
  },
});

@injectSheet(styles)
class SettingsPanelGeneralImpl extends React.PureComponent<Props, {}> {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.header}>
          <div>
            {remote.app.name}
            <span className={classes!.thin}>version {remote.app.getVersion()}</span>
          </div>

          <SettingsUpdatesButton />
        </div>

        <SettingsAutoLaunch />

        <SettingsDownloadFolder
          currentDownloadFolder={this.props.downloadFolder}
          onBrowseClick={this.props.clickBrowseDownloadFolder}
          onDownloadLocationClick={this.props.onDownloadLocationClick}
        />

        <SettingsDeveloperTools
          onClickOpenProcessManager={this.props.openProcessManager}
        />

      </div>
    );
  }
}

const SettingsPanelGeneral = connect<StateProps, DispatchProps, MergeProps>(
  (state: StationState) => ({
    areBetaIncludedInUpdates: Boolean(areBetaIncludedInUpdates(state)),
    downloadFolder: getDownloadFolder(state),
  }),
  dispatch => bindActionCreators(
    {
      clickBrowseDownloadFolder,
      revealPathInFinder,
      openProcessManager,
    },
    dispatch
  ),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onDownloadLocationClick: () =>
      dispatchProps.revealPathInFinder(stateProps.downloadFolder),
  })
)(SettingsPanelGeneralImpl);

export default SettingsPanelGeneral as React.ComponentType<OwnProps>;