import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
    Switch,
    Typography,
    Grid,
    Slider,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { makeStyles, withTheme } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nui from '../../util/Nui';

const MAX_PRESETS = 5;
const PRESETS_STORAGE_KEY = 'hud_presets';
const DEFAULT_SETTINGS = {
    statusIconToggle: true,
    statusVisible: true,
    speedVisible: true,
    minimapVisible: true,
    locationVisible: true,
    rpmVisible: true,
    fuelVisible: true,
    metricUnits: true,
    positions: {
        horizStatusPos: 50,
        vertStatusPos: 1,
        horizVehiclePos: 50,
        vertVehiclePos: 5,
        horizMinimapPos: 0,
        vertMinimapPos: 0,
        horizLocationPos: 16,
        vertLocationPos: 3,
        statusPos: 'BottomLeft'
    },
};

const useStyles = makeStyles((theme) => ({
    container: {
        color: '#fff',
        borderRadius: 8,
        width: '100%',
        maxWidth: '500px',
    },
    header: {
        fontWeight: 'bold',
        fontSize: '1.4em',
        marginTop: 10,
        marginBottom: 10,
        position: 'sticky',
        top: 0,
        backgroundColor: theme.palette.secondary.dark,
        zIndex: 2,
        padding: '5px 0',
    },
    sectionHeader: {
        fontSize: '1.2em',
        marginBottom: 15,
        fontWeight: '600',
    },
    subHeader: {
        fontSize: '1.1em',
        marginTop: 20,
        fontWeight: '600',
    },
    switchLabel: {
        display: 'flex',
        alignItems: 'center',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        marginRight: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    },
    resetButton: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        marginRight: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    },
    closeButton: {
        backgroundColor: theme.palette.error.main,
        color: '#fff',
        marginLeft: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    },
    createButton: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        marginRight: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    },
    deleteButton: {
        backgroundColor: theme.palette.error.main,
        color: '#fff',
        marginLeft: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    },
    icon: {
        marginRight: 5,
    },
    sliderContainer: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: theme.palette.background.paper,
        marginTop: 15,
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${theme.palette.secondary.light}`,
    },
    sliderLabel: {
        marginRight: 10,
        fontSize: '1em',
        minWidth: '125px',
    },
    dialogContent: {
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '0 20px',
        '&::-webkit-scrollbar': {
            width: 5,
        },
        '&::-webkit-scrollbar-track': {
            background: theme.palette.secondary.main,
        },
        '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.main,
            borderRadius: 5,
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.primary.dark,
        },
    },
}));

const statusLocs = [
    {
        pos: 'BottomLeft',
        name: 'Bottom Left'
    }, 
    {
        pos: 'BottomCenter',
        name: 'Bottom Center'
    }, 
    {
        pos: 'BottomRight',
        name: 'Bottom Right'
    },
    {
        pos: 'TopLeft',
        name: 'Top Left'
    }, 
    {
        pos: 'TopCenter',
        name: 'Top Center'
    }, 
    {
        pos: 'TopRight',
        name: 'Top Right'
    },
]

export default withTheme(() => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const isShowing = useSelector((state) => state.menu.hudMenu);
    const isHUDShowing = useSelector((state) => state.hud.showing);
    const hudConfig = useSelector((state) => state.hud.config);

    const [statusIconToggle, setStatusIconToggle] = useState(hudConfig?.statusIconToggle || DEFAULT_SETTINGS.statusIconToggle);
    const [statusVisible, setStatusVisible] = useState(hudConfig?.statusVisible || DEFAULT_SETTINGS.statusVisible);
    const [speedVisible, setSpeedVisible] = useState(hudConfig?.speedVisible || DEFAULT_SETTINGS.speedVisible);
    const [minimapVisible, setMinimapVisible] = useState(hudConfig?.minimapVisible || DEFAULT_SETTINGS.minimapVisible);
    const [locationVisible, setLocationVisible] = useState(hudConfig?.locationVisible || DEFAULT_SETTINGS.locationVisible);
    const [rpmVisible, setRpmVisible] = useState(hudConfig?.rpmVisible || DEFAULT_SETTINGS.rpmVisible);
    const [fuelVisible, setFuelVisible] = useState(hudConfig?.fuelVisible || DEFAULT_SETTINGS.fuelVisible);
    const [metricUnits, setMetricUnits] = useState(hudConfig?.metricUnits || DEFAULT_SETTINGS.metricUnits);
    const [positions, setPositions] = useState(hudConfig?.positions || DEFAULT_SETTINGS.positions);

    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState('Default');

    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && hudConfig && isHUDShowing) {
            console.log('Waited for HUD to show:', JSON.stringify(hudConfig));
            applySettings(hudConfig);
            initialized.current = true;
        }
    }, [hudConfig, isHUDShowing]);

    useEffect(() => {
        const storedPresets = JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY)) || [];
        setPresets(storedPresets.length ? storedPresets : [{ name: 'Default', settings: DEFAULT_SETTINGS }]);
    }, []);

    useEffect(() => {
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    }, [presets]);

    const getCurrentSettings = () => ({
        statusIconToggle,
        statusVisible,
        speedVisible,
        minimapVisible,
        locationVisible,
        rpmVisible,
        fuelVisible,
        metricUnits,
        ...positions,
    });

    const applySettings = (settings) => {
        setStatusIconToggle(settings?.statusIconToggle ?? DEFAULT_SETTINGS.statusIconToggle);
        setStatusVisible(settings?.statusVisible ?? DEFAULT_SETTINGS.statusVisible);
        setSpeedVisible(settings?.speedVisible ?? DEFAULT_SETTINGS.speedVisible);
        setMinimapVisible(settings?.minimapVisible ?? DEFAULT_SETTINGS.minimapVisible);
        setLocationVisible(settings?.locationVisible ?? DEFAULT_SETTINGS.locationVisible);
        setRpmVisible(settings?.rpmVisible ?? DEFAULT_SETTINGS.rpmVisible);
        setFuelVisible(settings?.fuelVisible ?? DEFAULT_SETTINGS.fuelVisible);
        setMetricUnits(settings?.metricUnits ?? DEFAULT_SETTINGS.metricUnits);
        setPositions(settings?.positions ?? DEFAULT_SETTINGS.positions);

        if (settings?.positions) {
            handlePositionChange('status', 'horizStatusPos')(null, settings.positions.horizStatusPos);
            handlePositionChange('status', 'vertStatusPos')(null, settings.positions.vertStatusPos);
            handlePositionChange('vehicle', 'horizVehiclePos')(null, settings.positions.horizVehiclePos);
            handlePositionChange('vehicle', 'vertVehiclePos')(null, settings.positions.vertVehiclePos);
            handlePositionChange('minimap', 'horizMinimapPos')(null, settings.positions.horizMinimapPos);
            handlePositionChange('minimap', 'vertMinimapPos')(null, settings.positions.vertMinimapPos);
            handlePositionChange('location', 'horizLocationPos')(null, settings.positions.horizLocationPos);
            handlePositionChange('location', 'vertLocationPos')(null, settings.positions.vertLocationPos);
            handlePositionChange('status', 'statusPos')(null, settings.positions.statusPos);
        } else {
            console.error('Positions missing in applySettings');
        }
    };

    const resetAll = () => {
        applySettings(DEFAULT_SETTINGS);

        dispatch({ type: 'RESET_HUD_POSITIONS', payload: DEFAULT_SETTINGS.positions });
        dispatch({ type: 'UPDATE_STATUS', payload: { statusIconToggle: DEFAULT_SETTINGS.statusIconToggle } });
        dispatch({ type: 'SHOW_STATUS', payload: { visible: DEFAULT_SETTINGS.statusVisible } });
        dispatch({ type: 'TOGGLE_VEHICLE', payload: { showing: DEFAULT_SETTINGS.speedVisible } });
        dispatch({ type: 'TOGGLE_LOC', payload: { state: DEFAULT_SETTINGS.locationVisible } });
        dispatch({ type: 'UPDATE_FUEL', payload: { fuelHide: !DEFAULT_SETTINGS.fuelVisible } });
        dispatch({ type: 'UPDATE_SPEED_MEASURE', payload: { metricUnits: DEFAULT_SETTINGS.metricUnits } });

        setSelectedPreset('Default');
    };

    const handlePresetChange = (event) => {
        const newPreset = event.target.value;
        setSelectedPreset(newPreset);
        const preset = presets.find((p) => p.name === newPreset);
        if (preset) {
            applySettings(preset.settings);
        }
    };

    const handleCreateNewPreset = () => {
        if (presets.length >= MAX_PRESETS) return;
        const newPresetName = `Preset ${presets.length + 1}`;
        const newPreset = { name: newPresetName, settings: getCurrentSettings() };
        setPresets([...presets, newPreset]);
        setSelectedPreset(newPresetName);
    };

    const handleDeletePreset = () => {
        if (selectedPreset !== 'Default') {
            const updatedPresets = presets.filter((preset) => preset.name !== selectedPreset);
            setPresets(updatedPresets);
            setSelectedPreset('Default');
            applySettings(presets[0].settings);
        }
    };

    const handleStatusIconToggle = (event, newValue = !statusIconToggle) => {
        setStatusIconToggle(newValue);
    
        dispatch({
            type: 'UPDATE_STATUS',
            payload: {
                ...hudConfig,
                statusIconToggle: newValue,
            },
        });
    };
    
    const handleStatusVisible = (event, newValue = !statusVisible) => {
        setStatusVisible(newValue);
        if (newValue) {
            dispatch({ type: 'SHOW_STATUS' });
        } else {
            dispatch({ type: 'HIDE_STATUS' });
        }
    };
    
    const handleSpeedToggle = (event, newValue = !speedVisible) => {
        setSpeedVisible(newValue);
        dispatch({
            type: 'TOGGLE_VEHICLE',
            payload: { showing: newValue },
        });
    };
    
    const handleMinimapToggle = (event, newValue = !minimapVisible) => {
        setMinimapVisible(newValue);
    };
    
    const handleLocationToggle = (event, newValue = !locationVisible) => {
        setLocationVisible(newValue);
        dispatch({
            type: 'TOGGLE_LOC',
            payload: { state: newValue },
        });
    };
    
    const handleRpmToggle = (event, newValue = !rpmVisible) => {
        setRpmVisible(newValue);
    };
    
    const handleFuelToggle = (event, newValue = !fuelVisible) => {
        setFuelVisible(newValue);
        dispatch({
            type: 'UPDATE_FUEL',
            payload: { fuelHide: !newValue },
        });
    };
    
    const handleUnitsToggle = (event, newValue = !metricUnits) => {
        setMetricUnits(newValue);
        dispatch({
            type: 'UPDATE_SPEED_MEASURE',
            payload: { metricUnits: newValue },
        });
    
        Nui.send('UnitData', {
            speedMeasure: newValue ? 'MPH' : 'KM/H',
        });
    };

    const handleStatusPosChange = (event) => {
        const newValue = event.target.value;
        setPositions((prev) => ({
            ...prev,
            statusPos: newValue,
        }));
    
        dispatch({
            type: 'UPDATE_HUD_POSITION',
            payload: {
                element: 'status',
                axis: 'statusPos',
                value: newValue,
            },
        });
    };
    
    const handlePositionChange = (element, axis) => (event, newValue) => {
        setPositions(prev => ({
            ...prev,
            [axis]: newValue
        }));
    
        dispatch({
            type: 'UPDATE_HUD_POSITION',
            payload: {
                element,
                axis,
                value: newValue,
            },
        });
    };

    const onSave = (e) => {
        e.preventDefault();
    
        const hudConfig = {
            statusIconToggle,
            statusVisible,
            speedVisible,
            minimapVisible,
            locationVisible,
            rpmVisible,
            fuelVisible,
            metricUnits,
            positions: {
                horizStatusPos: positions.horizStatusPos,
                vertStatusPos: positions.vertStatusPos,
                horizVehiclePos: positions.horizVehiclePos,
                vertVehiclePos: positions.vertVehiclePos,
                horizMinimapPos: positions.horizMinimapPos,
                vertMinimapPos: positions.vertMinimapPos,
                horizLocationPos: positions.horizLocationPos,
                vertLocationPos: positions.vertLocationPos,
                statusPos: positions.statusPos
            },
        };
    
        dispatch({
            type: 'SET_CONFIG',
            payload: { config: hudConfig },
        });
    
        Nui.send('SaveConfig', hudConfig);
        onClose();
    };

    const onClose = () => {
        dispatch({
            type: 'TOGGLE_MENU',
            payload: {
                state: false,
            },
        });
        Nui.send('CloseUI');
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={isShowing} className={classes.container}>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6" className={classes.header}>HUD Settings</Typography>
                <Typography className={classes.sectionHeader}>Preset & Styles</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Presets</InputLabel>
                            <Select value={selectedPreset} onChange={handlePresetChange} label="Presets">
                                {presets.map((preset, index) => (
                                    <MenuItem key={index} value={preset.name}>
                                        {preset.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <div className={classes.buttonContainer}>
                    <Button variant="contained" className={classes.createButton} onClick={handleCreateNewPreset}>
                        <FontAwesomeIcon icon="plus" className={classes.icon} /> New Preset
                    </Button>
                    <Button variant="contained" className={classes.deleteButton} onClick={handleDeletePreset}>
                        <FontAwesomeIcon icon="trash" className={classes.icon} /> Delete
                    </Button>
                </div>
                <Typography className={classes.sectionHeader}>HUD Visibility</Typography>
                <div className={classes.sliderContainer}>
                    <FormControlLabel
                        control={<Switch checked={statusIconToggle} onChange={handleStatusIconToggle} />}
                        label={
                            <span className={classes.switchLabel}>
                                <FontAwesomeIcon icon={statusIconToggle ? "icons" : "fa-arrow-down-9-1"} className={classes.icon} />
                                {statusIconToggle ? "Status Icons" : "Status Numbers"}
                            </span>
                        }
                    />
                </div>
                <div className={classes.sliderContainer}>
                    <FormControlLabel
                        control={<Switch checked={statusVisible} onChange={handleStatusVisible} />}
                        label={
                            <span className={classes.switchLabel}>
                                <FontAwesomeIcon icon={statusVisible ? "square-poll-vertical" : "chart-simple"} className={classes.icon} />
                                {statusVisible ? 'Hide Status' : 'Show Status'}
                            </span>
                        }
                    />
                </div>
                <div className={classes.sliderContainer}>
                    <FormControlLabel
                        control={<Switch checked={speedVisible} onChange={handleSpeedToggle} />}
                        label={
                            <span className={classes.switchLabel}>
                                <FontAwesomeIcon icon={speedVisible ? "gauge" : "gauge-high"} className={classes.icon} />
                                {speedVisible ? 'Hide Speedometer' : 'Show Speedometer'}
                            </span>
                        }
                    />
                </div>
                <div className={classes.sliderContainer}>
                    <FormControlLabel
                        control={<Switch checked={minimapVisible} onChange={handleMinimapToggle} />}
                        label={
                            <span className={classes.switchLabel}>
                                <FontAwesomeIcon icon={minimapVisible ? "map-location-dot" : "map"} className={classes.icon} />
                                {minimapVisible ? 'Hide Minimap' : 'Show Minimap'}
                            </span>
                        }
                    />
                </div>
                <div className={classes.sliderContainer}>
                    <FormControlLabel
                        control={<Switch checked={locationVisible} onChange={handleLocationToggle} />}
                        label={
                            <span className={classes.switchLabel}>
                                <FontAwesomeIcon icon={locationVisible ? "map-pin" : "location-dot"} className={classes.icon} />
                                {locationVisible ? 'Hide Location' : 'Show Location'}
                            </span>
                        }
                    />
                </div>
                <div className={classes.sliderContainer}>
                    <FormControlLabel
                        control={<Switch checked={rpmVisible} onChange={handleRpmToggle} />}
                        label={
                            <span className={classes.switchLabel}>
                                <FontAwesomeIcon icon={rpmVisible ? "gauge" : "gauge-high"} className={classes.icon} />
                                {rpmVisible ? 'Hide RPM' : 'Show RPM'}
                            </span>
                        }
                    />
                </div>
                <div className={classes.sliderContainer}>
                    <FormControlLabel
                        control={<Switch checked={fuelVisible} onChange={handleFuelToggle} />}
                        label={
                            <span className={classes.switchLabel}>
                                <FontAwesomeIcon icon="gas-pump" className={classes.icon} />
                                {fuelVisible ? 'Hide Fuel' : 'Show Fuel'}
                            </span>
                        }
                    />
                </div>
                <div className={classes.sliderContainer}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Switch checked={metricUnits} onChange={handleUnitsToggle} color="primary" /> }
                            label={
                                <span className={classes.switchLabel}>
                                    <FontAwesomeIcon icon="tachograph-digital" className={classes.icon} /> Metric Units <span className={classes.unitLabel}> ({metricUnits ? 'MPH' : 'KM/H'}) </span>
                                </span>
                            }
                        />
                    </Grid>
                </div>

                <Grid item xs={12}>
                    <Typography className={classes.subHeader}>Status HUD Position</Typography>
                    <div className={classes.sliderContainer}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Position</InputLabel>
                            <Select value={positions.statusPos} onChange={handleStatusPosChange} label="Position">
                                {statusLocs.map((status, index) => (
                                    <MenuItem key={status.pos} value={status.pos}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Typography className={classes.subHeader}>Vehicle HUD Position</Typography>
                    <div className={classes.sliderContainer}>
                        <Typography variant="body2" className={classes.sliderLabel}>Horizontal Position</Typography>
                        <Slider
                            value={positions.horizVehiclePos}
                            min={0}
                            max={100}
                            step={1}
                            valueLabelDisplay="auto"
                            onChange={handlePositionChange('horizVehicle', 'horizVehiclePos')}
                            aria-labelledby="horizontal-position-slider"
                            disabled
                        />
                    </div>
                    <div className={classes.sliderContainer}>
                        <Typography variant="body2" className={classes.sliderLabel}>Vertical Position</Typography>
                        <Slider
                            value={positions.vertVehiclePos}
                            min={0}
                            max={95}
                            step={1}
                            valueLabelDisplay="auto"
                            onChange={handlePositionChange('vertVehicle', 'vertVehiclePos')}
                            aria-labelledby="vertical-position-slider"
                            disabled
                        />
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Typography className={classes.subHeader}>Minimap Position</Typography>
                    <div className={classes.sliderContainer}>
                        <Typography variant="body2" className={classes.sliderLabel}>Horizontal Position</Typography>
                        <Slider
                            value={positions.horizMinimapPos}
                            min={0}
                            max={100}
                            step={1}
                            valueLabelDisplay="auto"
                            onChange={handlePositionChange('horizMinimap', 'horizMinimapPos')}
                            aria-labelledby="horizontal-position-slider"
                            disabled
                        />
                    </div>
                    <div className={classes.sliderContainer}>
                        <Typography variant="body2" className={classes.sliderLabel}>Vertical Position</Typography>
                        <Slider
                            value={positions.vertMinimapPos}
                            min={0}
                            max={100}
                            step={1}
                            valueLabelDisplay="auto"
                            onChange={handlePositionChange('vertMinimap', 'vertMinimapPos')}
                            aria-labelledby="vertical-position-slider"
                            disabled
                        />
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Typography className={classes.subHeader}>Location Position</Typography>
                    <div className={classes.sliderContainer}>
                        <Typography variant="body2" className={classes.sliderLabel}>Horizontal Position</Typography>
                        <Slider
                            value={positions.horizLocationPos}
                            min={0}
                            max={100}
                            step={1}
                            valueLabelDisplay="auto"
                            onChange={handlePositionChange('horizLocation', 'horizLocationPos')}
                            aria-labelledby="horizontal-position-slider"
                            disabled
                        />
                    </div>
                    <div className={classes.sliderContainer}>
                        <Typography variant="body2" className={classes.sliderLabel}>Vertical Position</Typography>
                        <Slider
                            value={positions.vertLocationPos}
                            min={0}
                            max={95}
                            step={1}
                            valueLabelDisplay="auto"
                            onChange={handlePositionChange('vertLocation', 'vertLocationPos')}
                            aria-labelledby="vertical-position-slider"
                            disabled
                        />
                    </div>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onSave}
                    className={classes.saveButton}
                >
                    <FontAwesomeIcon icon="save" className={classes.icon} /> Save All
                </Button>
                <Button
                    onClick={resetAll}
                    className={classes.resetButton}
                >
                    <FontAwesomeIcon icon="redo" className={classes.icon} /> Reset All
                </Button>
                <Button
                    onClick={onClose}
                    className={classes.closeButton}
                >
                    <FontAwesomeIcon icon="xmark" className={classes.icon} /> Close
                </Button>
            </DialogActions>
        </Dialog>
    );
});
