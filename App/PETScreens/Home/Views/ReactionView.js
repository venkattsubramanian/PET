import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { likeApi } from '../../../../Reducers/LikePostReducer';
import { getCommentCountApi, getcommentCountData } from '../../../../Reducers/CommentReducer';

export default function ReactionView({ postId, likeCount, isLike: initialIsLike, isCommentDisable }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(initialIsLike === 1);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [commentCount, setCommentCount] = useState(0);  
  const commentCountData = useSelector(getcommentCountData); 

  useEffect(() => {
    setIsLiked(initialIsLike === 1);
    setCurrentLikeCount(likeCount);
  }, [initialIsLike, likeCount]);

  useEffect(() => {
    const fetchCommentCount = async () => {
      const result = await dispatch(getCommentCountApi(postId));
      if (result.payload?.commentCount !== undefined) {
        setCommentCount(result.payload.commentCount);
      }
    };
    fetchCommentCount();
  }, [dispatch, postId]);

  const handlePress = async () => {
    try {
      const payload = { userPostId: postId, userId: 2 }; // Set userId statically

      if (!isLiked) {
        setIsLiked(true);
        setCurrentLikeCount(currentLikeCount + 1);
        await dispatch(likeApi(payload)); 
      } else {
        setIsLiked(false);
        setCurrentLikeCount(currentLikeCount - 1);
        await dispatch(likeApi(payload)); 
      }
    } catch (error) {
      console.error('Error dispatching like/dislike API:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to update like status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCommentPress = () => {
    if (isCommentDisable) {
      Alert.alert('Comments are disabled for this post');
    } else {
      navigation.navigate('Comment', {
        postId,
        onDismiss: () => {
          // Fetch the updated comment count when the Comment screen is dismissed
          dispatch(getCommentCountApi(postId)).then((result) => {
            if (result.payload?.commentCount !== undefined) {
              setCommentCount(result.payload.commentCount);
            }
          });
        },
      });
    }
  };
  
  // Rest of the code remains the same...
  

  return (
    <View style={styles.container}>
      <View style={styles.viewList}>
        <TouchableOpacity onPress={handlePress}>
        <Image
         style={styles.heartImage}
         source={isLiked ? require('../../../../assets/images/heartFill.png') :require('../../../../assets/images/heart.png')}
          tintColor={isLiked ? 'red' : 'grey'}
       />
        </TouchableOpacity>
        <Text style={styles.heartCount}>{currentLikeCount} likes</Text>

        <TouchableOpacity onPress={handleCommentPress}>
          <Image 
            style={{ height: 20, width: 20, left: 20 }} 
            source={require('../../../../assets/images/chatR.png')} 
          />
        </TouchableOpacity>
        <Text style={styles.commentCount}>{commentCount} comments</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    width: 380,
    top: 0,
  },
  viewList: {
    flexDirection: 'row',
    padding: 0,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 25,
    width: 200,
    bottom: -10
  },
  heartImage: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  heartCount: {
    color: 'grey',
    fontSize: 18,
    left: 5,
    top: -2,
  },
  commentCount: {
    color: 'grey',
    fontSize: 18,
    left: 25,
    top: -2,
  },
});
