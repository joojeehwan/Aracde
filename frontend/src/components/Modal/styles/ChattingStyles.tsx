import styled from '@emotion/styled';

export const ChatWrapper = styled.div`
  display: flex;
  margin-left: 10px;
  padding: 8px 10px;
  z-index: 1;
  width: 219px;
  & .chat-img {
    display: flex;
    width: 36px;
    margin-right: 4px;
  }

  & .chat-text {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    & p {
      flex: 0 0 100%;
      margin: 0;
    }
  }

  & .chat-user {
    display: flex;
    flex: 0 0 100%;
    align-items: center;

    & > b {
      margin-right: 5px;
    }

    & > span {
      font-size: 12px;
    }
  }

  & a {
    text-decoration: none;
    color: deepskyblue;
  }
`;

export const Section = styled.section`
  margin-top: 20px;
  border-top: 1px solid #eee;
`;

export const StickyHeader = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  width: 100%;
  position: sticky;
  top: 14px;

  & button {
    color: red;
    font-weight: bold;
    font-size: 13px;
    height: 28px;
    line-height: 27px;
    padding: 0 16px;
    z-index: 2;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    position: relative;
    top: -13px;
    background: white;
    border: none;
    outline: none;
  }
`;
