import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image, Text, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCommentApi, commentApi, commentDetails, deleteCommentApi, editCommentApi } from '../../../../Reducers/CommentReducer'; 
import { useFocusEffect } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

export default function Comment({ route, navigation }) {
  const { postId, onDismiss } = route.params;
  const dispatch = useDispatch();
  const { getcommentData, getcommentStatus, commentStatus, deleteCommentStatus, editcommentStatus } = useSelector(commentDetails);
  const actionSheetRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);

  // Loader visibility state
  const isLoading = getcommentStatus === 'loading' || 
    commentStatus === 'loading' || 
    deleteCommentStatus === 'loading' || 
    editcommentStatus === 'loading';

  useEffect(() => {
    const fetchComments = async () => {
      const result = await dispatch(getCommentApi(postId));
      if (result.meta.requestStatus === 'fulfilled') {
        setComments(result.payload?.comments || []);
      }
    };
    fetchComments();
  }, [dispatch, postId]);

  const addOrEditComment = async () => {
    if (!commentText.trim()) return;

    if (selectedComment) {
      const editComment = { content: commentText };
      const result = await dispatch(editCommentApi({ commentId: selectedComment.id, updatedData: editComment }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setComments(comments.map(comment => 
          comment.id === selectedComment.id ? { ...comment, content: commentText } : comment
        ));
        resetCommentInput();
        Toast.show({ type: 'success', text1: 'Comment updated successfully!' });
      } else {
        Alert.alert('Error', 'Failed to edit comment');
      }
    } else {
      const newComment = { userPostId: postId, userId: 1, content: commentText };
      const result = await dispatch(commentApi(newComment));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setComments([{ id: result.payload.data.id, ...newComment }, ...comments]);
        resetCommentInput();
        Toast.show({ type: 'success', text1: 'Comment added successfully!' });
      } else {
        Alert.alert('Error', 'Failed to add comment');
      }
    }
  };

  const resetCommentInput = () => {
    setSelectedComment(null);
    setCommentText('');
  };

  const showActionSheet = (comment) => {
    setSelectedComment(comment);
    setCommentText(comment.content); 
    actionSheetRef.current?.show();
  };

  const handleActionSheetPress = (index) => {
    if (index === 0) {  // Edit
      setCommentText(selectedComment.content);
    } else if (index === 1) {  // Delete
      handleDeleteComment();
    }
  };

  const handleDeleteComment = async () => {
    if (selectedComment) {
      const result = await dispatch(deleteCommentApi(selectedComment.id));
      if (result.meta.requestStatus === 'fulfilled') {
        setComments(comments.filter(comment => comment.id !== selectedComment.id));
        resetCommentInput();
        Toast.show({ type: 'success', text1: 'Comment deleted successfully!' });
      } else {
        Alert.alert('Error', 'Failed to delete comment');
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (onDismiss) onDismiss();  // Update comment count on screen exit
      };
    }, [onDismiss])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 60 })}
    >
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#018CE0" />
        </View>
      ) : (
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {comments.length === 0 ? (
            <Text style={styles.noCommentsText}>No comments found</Text>
          ) : (
            comments.map(comment => (
              <TouchableOpacity key={comment.id} onLongPress={() => showActionSheet(comment)}>
                <View style={styles.commentContainer}>
                  <Image source={require('../../../../assets/images/avatarP.png')} style={styles.profileImage} />
                  <View style={styles.commentContent}>
                    <Text style={styles.username}>User {comment.userId}</Text>
                    <Text>{comment.content}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
     
          <ActionSheet
            ref={actionSheetRef}
            title={'What do you want to do?'}
            options={['Edit', 'Delete', 'Cancel']}
            cancelButtonIndex={2}
            onPress={handleActionSheetPress}
          />
        </KeyboardAwareScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="gray"
          onChangeText={text => setCommentText(text)} 
          value={commentText}
        />

        <TouchableOpacity style={styles.addButton} onPress={addOrEditComment}>
          <Text style={styles.addButtonText}>{selectedComment ? 'Send' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
      <Toast />                                  
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#BCC1CA',
    borderRadius: 25,
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#018CE0',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  addButton: {
    backgroundColor: '#018CE0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noCommentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 100,
  },
});
