import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fade, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useKeypress from 'react-use-keypress';
import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
    outer: {
        width: '100%',
        position: 'absolute',
        bottom: '50%',
        textAlign: 'center',
        transform: 'translateY(50%)',
    },
    menuOuter: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    menuList: {
        listStyle: 'none',
        width: 'fit-content',
        height: 'fit-content',
        position: 'absolute',
        left: '-182px',
        right: 0,
        top: 45,
        margin: 'auto',
        textAlign: 'left',
        transform: 'translateX(25%)',
        fontSize: 18,
    },
    menuItem: {
        color: theme.palette.text.main,
        marginBottom: '10px',
        marginTop: '8px',
        transition: 'color ease-in 0.15s',
        fontWeight: '600',
        lineHeight: '37px',
        border: `1px solid #9ce60d`,
        borderRadius: '4px',
        paddingLeft: 17,
        width: 269,
        background: 'linear-gradient(to bottom, #1F300385 10%, #5C740070 30%, #1C2A07A8 90%)',
        textAlign: 'left',
        fontFamily: 'arial',
        height: 37,
        fontSize: 13,
        // lineHeight: 100,
        margin: 'auto',
        textAlign: 'left',
        // textShadow: '0 0 5px #000',
        userSelect: 'none',
        overflow: 'hidden',
        whiteSpace: 'nowrap', 
        textOverflow: 'ellipsis',
        '&:hover': {
            // color: theme.palette.primary.light,
            color: '#9ce60d',
            cursor: 'pointer',
        },
        '& svg': {
            marginRight: 10,
            color: '#9ce60d',
        },
    },
    icon: {
        fontSize: '0.75rem',
        background: '#dddddd73',
        border: '2px solid #dddddd73',
        borderRadius: '50%',
        color: '#ffffff99',
        transition: '.5s',
        padding: '7px',
    },
    focused: {
        fontSize: '1.5rem',
        color: '#a4e124',
        background: '#a3a3a300',
        backgroundSize: '50%',
        border: '4px solid #a3a3a300',
    },
}));

export default () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const showing = useSelector((state) => state.thirdEye.showing);
    const icon = useSelector((state) => state.thirdEye.icon);
    const menuOpen = useSelector((state) => state.thirdEye.menuOpen);
    const menu = useSelector((state) => state.thirdEye.menu);

    const menuButtonClick = (e, event, data) => {
        e.stopPropagation();
        Nui.send('targetingAction', {
            event,
            data,
        });
    };

    const closeMenu = () => {
        Nui.send('targetingAction', false);
    };

    useKeypress(['Escape', 'Backspace'], () => {
        if (!showing) return;
        else closeMenu();
    });

    const menuElements = menu.map((button, i) => {
        return (
            <li
                key={i}
                color="secondary"
                onClick={(e) => menuButtonClick(e, button.event, button.data)}
                variant="contained"
                className={classes.menuItem}
            >
                {button.icon && <FontAwesomeIcon icon={button.icon} />}
                {button.text}
            </li>
        );
    });

    if (menuElements.length <= 1) {
        menuElements.push(<div className={classes.menuButton} key={'x'}></div>);
        menuElements.reverse();
    }

    let menuRadius = 50 + menuElements.length * 1.8 * 10;

    if (menuRadius < 80) {
        menuRadius = 80;
    } else if (menuRadius > 900) {
        menuRadius = 900;
    }

    return (
        <Fragment>
            <Fade in={showing} duration={1500}>
                <div className={classes.outer}>
                    <FontAwesomeIcon
                        className={`${icon && classes.focused} ${classes.icon}`}
                        icon={icon ? icon : 'circle'}
                    />
                    <Fade
                        in={menuOpen && menuElements.length > 0}
                        duration={1500}
                    >
                        <ul className={classes.menuList}>{menuElements}</ul>
                    </Fade>
                </div>
            </Fade>
        </Fragment>
    );
};