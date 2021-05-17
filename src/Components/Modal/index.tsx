
import React from 'react';
import Modal from 'react-native-modal';
import Styled from 'styled-components/native';

const Container = Styled.View`flex: 1;`;
const ModalContainer = Styled.View`width: 70%; height: 30%; border-radius: 30px; background-color: #EEE;`;
const ModalBody = Styled.View``;
const ModalFooter = Styled.View``;
const BodyText = Styled.Text`font-size: 20px;`;

// 아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
// useNativeDriver={true}
const ModalView = () => {
    return (
        <Container>
            <Modal 
                isVisible={true} 
                hideModalContentWhileAnimating={true}
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                <ModalContainer>
                    {/* <BodyText>I am the modal content!</BodyText> */}
                </ModalContainer>
            </Modal>
        </Container>
    )
}

export default ModalView;