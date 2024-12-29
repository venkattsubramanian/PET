import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bubble } from 'react-native-gifted-chat';
import { format, isSameDay, isYesterday, isToday } from 'date-fns';

const CustomMessage = (props) => {
  const { currentMessage, previousMessage } = props;
  const isUserMessage = currentMessage.isUser; // True if the message is from the current user

  // Determine if the date label should be shown
  const showDateHeader = !isSameDay(currentMessage.createdAt, previousMessage?.createdAt);

  // Determine the label to display
  let dayLabel = '';
  if (isToday(currentMessage.createdAt)) {
    dayLabel = 'Today';
  } else if (isYesterday(currentMessage.createdAt)) {
    dayLabel = 'Yesterday';
  } else {
    dayLabel = format(currentMessage.createdAt, 'MMMM dd, yyyy');
  }

  return (
    <View>
      {showDateHeader && (
        <Text style={styles.dateHeader}>{dayLabel}</Text>
      )}
      <Bubble
        {...props}
        renderTime={() => null}
        wrapperStyle={{
          right: isUserMessage ? { backgroundColor: '#018CE0' } : {},
          left: !isUserMessage ? { backgroundColor: 'grey' } : {},
        }}
      />
      <Text style={[styles.timeText, isUserMessage ? styles.timeTextRight : styles.timeTextLeft]}>
        {new Date(currentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dateHeader: {
    backgroundColor: '#f0f0f0',  
    color: '#333',               
    fontWeight: 'bold',          
    fontSize: 12,               
    textAlign: 'center',         
    paddingVertical: 5,          
    paddingHorizontal: 10,       
    marginVertical: 10,          
    borderRadius: 20,             
    alignSelf: 'center',         
  },
  timeText: {
    color: 'gray',
    fontSize: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  timeTextRight: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  timeTextLeft: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
});

export default CustomMessage;
