import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid, LinearProgress, Fade, Box } from '@mui/material';
import { withStyles, makeStyles } from '@mui/styles';
import useInterval from 'react-useinterval';

import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: '100%',
        maxWidth: 350,
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    label: {
        color: theme.palette.text.main,
        fontSize: 18,
        textShadow: '0 0 5px #000',
    },
    progressbar: {
        transition: 'none !important',
        margin: 2.3,
        borderRadius: 2,
    },
    percent: {
        textAlign: 'right',
        fontSize: 18,
        color: '#01cfdeff',
    },
    progressbarContainer: {
        padding: 5.3,
        border: '1px solid rgba(198, 243, 85, 0.5)',
        borderRadius: 4,
        marginTop: theme.spacing(1),
                color: '#01cfdeff',
    },
    progressbarBackground: {
        padding: 0.5,
        background: 'repeating-linear-gradient(-45deg, rgba(77, 77, 77, 0.2), rgba(77, 77, 77, 0.2) 10px, rgba(128, 128, 128, 0.2) 10px, rgba(128, 128, 128, 0.2) 20px)',
        borderRadius: 2,
                color: '#01cfdeff',
    },
}));

const mapStateToProps = (state) => ({
    showing: state.progress.showing,
    failed: state.progress.failed,
    cancelled: state.progress.cancelled,
    finished: state.progress.finished,
    label: state.progress.label,
    duration: state.progress.duration,
    startTime: state.progress.startTime,
});

const ProgressBar = ({
    cancelled,
    finished,
    failed,
    label,
    duration,
    startTime,
    dispatch,
}) => {
    const classes = useStyles();
    const [curr, setCurr] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const BorderLinearProgress = withStyles((theme) => ({
        root: {
            borderRadius: 2,
            height: 12.5,
        },
        colorPrimary: {
            background: 'transparent',
        },
        bar: {
            borderRadius: 2,
            backgroundColor: cancelled || failed ? "#6e1616" : '#01cfdeff',
            boxShadow: cancelled || failed ? "0px 0px 10px 0px #6e161699" : '0px 0px 10px 0px #01cfdeff',
        },
    }))(LinearProgress);

    useEffect(() => {
        setCurr(0);
        setIsVisible(true);
    }, [startTime]);

    useEffect(() => {
        if (cancelled || finished || failed) {
            setCurr(0);
            setIsVisible(false);
            if (finished) dispatch({ type: 'FINISH_PROGRESS' });
        }
    }, [cancelled, finished, failed]);

    const tick = () => {
        if (!cancelled && !finished && !failed) {
            const nextValue = curr + 10;
            if (nextValue >= duration) {
                dispatch({ type: 'FINISH_PROGRESS' });
            } else {
                setCurr(nextValue);
            }
        }
    };

    const hide = () => dispatch({ type: 'HIDE_PROGRESS' });

    useInterval(tick, isVisible ? 10 : null);

    const progressValue = cancelled || finished || failed ? 100 : (curr / duration) * 100;

    return (
        <Fade in={isVisible} duration={1000} onExited={hide}>
            <div className={classes.wrapper}>
                <Grid container className={classes.label}>
                    <Grid item xs={6}>
                        {failed ? 'Failed' : cancelled ? 'Cancelled' : label}
                    </Grid>
                    <Grid item xs={6} className={classes.percent}>
                        {!cancelled && !finished && !failed && (
                            <small>{Math.round(progressValue)}%</small>
                        )}
                    </Grid>
                </Grid>
                <Box className={classes.progressbarContainer}>
                    <Box className={classes.progressbarBackground}>
                        <BorderLinearProgress
                            variant="determinate"
                            value={progressValue}
                            classes={{ determinate: classes.progressbar }}
                        />
                    </Box>
                </Box>
            </div>
        </Fade>
    );
};

export default connect(mapStateToProps)(ProgressBar);