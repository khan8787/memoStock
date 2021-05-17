import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View`padding: 8px;`;
const Icon = Styled.Image`width: 15px; height: 15px;`;

interface Props {
    iconName: | 'up' | 'down' | 'noChange' | undefined ;
    style?: object;
}

const MovementIcon = ({iconName, style}: Props) => {
    const imageSource = {
        up: require('~/Assets/Images/arrow-up.png'),
        down: require('~/Assets/Images/arrow-down.png'),
        noChange: require('~/Assets/Images/dash.png'),
    }

    return (
        <Container style={style}>
            <Icon source={ iconName ? imageSource[iconName] : imageSource.noChange }/>
        </Container>
    )
}

export default MovementIcon;