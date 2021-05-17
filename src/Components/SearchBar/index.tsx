import React, { createContext, useState, useEffect } from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View`display: flex; flex-direction: row; align-items: center; width: 100%; height: 60px; margin-top: 10px;`;
const LabelContainer = Styled.View`min-width: 100px;`;
const InputContainer = Styled.View``;
const SearchContainer = Styled.TouchableOpacity``;

const Label = Styled.Text`font-size: 23px; color: #929292; font-family: 'NanumBarunpen-bold';`;
const InputField = Styled.TextInput`width: 180px; font-size: 23px; color: #292929; font-family: 'NanumBarunpen';`;
const Icon = Styled.Image`margin-left: 5px; width: 23px; height: 23px;`;

interface Props {
    label: string,
    placeholder: string;
    style?: Object;
    clearMode?: boolean;
    onSearchText: (text: string) => void;
}

const SearchBar = ({label, placeholder, onSearchText}: Props) => {

    return (
        <Container>
            <LabelContainer>
                <Label>{label}</Label>
            </LabelContainer>
            <InputContainer>
                <InputField 
                    selectionColor="#292929"
                    secureTextEntry={false}
                    keyboardType={'default'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    allowFontScaling={false}
                    placeholderTextColor="#C3C3C3"
                    placeholder={placeholder}
                    clearButtonMode={'while-editing'}
                    onChangeText={onSearchText}
                />
            </InputContainer>
            {/* {
                inputType === 'search' ? 
                <SearchContainer onPress={onClickSearch} >
                    <Icon source={require('~/Assets/Images/search_icon.png')} />
                </SearchContainer>
                // <Icon source={require('~/Assets/Images/search_icon.png')} onPress={onClickSearch} />
                :
                null
            } */}
        </Container>
    )
}

export default SearchBar;