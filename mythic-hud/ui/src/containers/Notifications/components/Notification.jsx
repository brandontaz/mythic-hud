import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Slide, CircularProgress, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useInterval from 'react-useinterval';
import { Sanitize } from '../../../util/Parser';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    alert: {
        marginBottom: 10,
        background: `${theme.palette.secondary.dark}a9`,
        '&.success': {
            background: '#4f6421a9',
        },
        '&.warning': {
            background: `${theme.palette.warning.dark}a9`,
        },
        '&.error': {
            background: '#6c2425a9',
        },
        '&.info': {
            background: '#2f7495a9',
        },
        borderRadius: '.5vh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    body: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        flex: 1,
    },
    progressContainer: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 5,
        right: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circularProgressBackground: {
        position: 'absolute',
        color: `${theme.palette.grey[300]}c4`,
        '&.success': {
            color: '#4f6421c4',
        },
        '&.warning': {
            color: `${theme.palette.warning.dark}c4`,
        },
        '&.error': {
            color: '#6c2425c4',
        },
        '&.info': {
            color: '#2f7495c4',
        },
    },
    circularProgress: {
        position: 'absolute',
        color: `${theme.palette.secondary.light}`,
        '.success &': {
            color: '#4f6421',
        },
        '.warning &': {
            color: `${theme.palette.warning.dark}`,
        },
        '.error &': {
            color: '#6c2425',
        },
        '.info &': {
            color: '#2f7495',
        },
    },
    icon: {
        marginRight: 10,
    },
    sticky: {
        marginRight: 10,
    },
}));

export default ({ notification }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [fin, setFin] = useState(false);
    const [timer, setTimer] = useState(0);

    const getTypeIcon = () => {
        switch (notification.type) {
            case 'success':
                return ['fas', 'circle-check'];
            case 'warning':
                return ['fas', 'triangle-exclamation'];
            case 'error':
                return ['fas', 'circle-xmark'];
            default:
                return ['fas', 'circle-info'];
        }
    };

    useEffect(() => {
        setFin(true);
    }, []);

    useEffect(() => {
        if (notification.duration > 0 && timer >= notification.duration) {
            setTimeout(() => {
                setFin(false);
            }, 250);
        }
    }, [timer]);

    useEffect(() => {
        if (notification.hide) {
            setFin(false);
        }
    }, [notification]);

    const onHide = () => {
        dispatch({
            type: 'REMOVE_ALERT',
            payload: {
                id: notification._id,
            },
        });
    };

    const onTick = () => {
        setTimer(timer + 100);
    };

    useInterval(
        onTick,
        notification < 0 || timer >= notification.duration ? null : 100,
    );

    return (
        <Slide direction="left" in={fin} onExited={onHide}>
            <div
                className={`${classes.alert} ${notification.type}`}
                style={
                    Boolean(notification?.style?.alert)
                        ? { ...notification?.style?.alert }
                        : null
                }
            >
                <div
                    className={classes.body}
                    style={
                        Boolean(notification?.style?.body)
                            ? { ...notification?.style?.body }
                            : null
                    }
                >
                    <div className={classes.icon}>
                        {notification.duration <= 0 && (
                            <FontAwesomeIcon
                                className={classes.sticky}
                                icon="thumbtack"
                            />
                        )}
                        <FontAwesomeIcon
                            icon={
                                Boolean(notification.icon)
                                    ? notification.icon
                                    : getTypeIcon()
                            }
                        />
                    </div>
                    {Sanitize(notification.message)}
                </div>
                {notification.duration > 0 && (
                    <Box className={classes.progressContainer}>
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={15}
                            className={classes.circularProgressBackground}
                        />
                        <CircularProgress
                            variant="determinate"
                            value={(timer / notification.duration) * 100}
                            size={15}
                            className={classes.circularProgress}
                        />
                    </Box>
                )}
            </div>
        </Slide>
    );
};
