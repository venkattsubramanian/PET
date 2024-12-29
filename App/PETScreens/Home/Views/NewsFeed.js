import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { Video } from 'expo-av';
import ReactionView from './ReactionView';
import { useSelector, useDispatch } from 'react-redux';
import { newsFeedApi, feedDetails, feedStatus } from '../../../../Reducers/FeedReducer'; 
import LoaderView from '../../../Components/LoaderView';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import ImageViewing from 'react-native-image-viewing';

export default function Home() {
  const dispatch = useDispatch();
  const feedData = useSelector(feedDetails); 
  const status = useSelector(feedStatus);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [playStates, setPlayStates] = useState({}); // Store play states for each video
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const videoRefs = useRef([]); // Store references to Video components

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(newsFeedApi());
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(newsFeedApi());
  }, [dispatch]);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const centerIndex = viewableItems.find(item => item.isViewable)?.index;
      if (centerIndex !== undefined) {
        setCurrentIndex(centerIndex);
        setPlayStates(prevPlayStates => {
          const newPlayStates = {};
          feedData.forEach((_, index) => {
            newPlayStates[index] = index === centerIndex;
          });
          return newPlayStates;
        });
      }
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const togglePlayPause = (index) => {
    setPlayStates(prevPlayStates => {
      const newPlayStates = {};
      feedData.forEach((_, i) => {
        newPlayStates[i] = i === index ? !prevPlayStates[i] : false;
      });
      return newPlayStates;
    });

    // Pause all other videos
    videoRefs.current.forEach((ref, i) => {
      if (ref && i !== index) {
        ref.pauseAsync();
      }
    });
  };

  const handleSingleTap = (index) => {
    // Toggle play/pause on single tap
    togglePlayPause(index);
  };

  const handleDoubleTap = (index) => {
    console.log('Video double-tapped');
    const currentVideoRef = videoRefs.current[index]; // Get the video ref using the index
    if (currentVideoRef && typeof currentVideoRef.presentFullscreenPlayer === 'function') {
      currentVideoRef.presentFullscreenPlayer(); // Trigger full-screen mode
      setPlayStates(prevPlayStates => ({
        ...prevPlayStates,
        [index]: true, // Ensure the video plays in full-screen mode
      }));
    }
  };

  const stopAllVideos = () => {
    videoRefs.current.forEach(ref => {
      if (ref) {
        ref.stopAsync(); // Stop each video
      }
    });
    setPlayStates({}); // Optionally clear play states
  };

  useFocusEffect(
    React.useCallback(() => {
      // Stop all videos when the screen loses focus
      return () => stopAllVideos();
    }, [])
  );

  const PostDescription = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleDescription = () => {
      setIsExpanded(!isExpanded);
    };
  
    return (
      <View>
        <Text style={styles.postDec} numberOfLines={isExpanded ? undefined : 2}>
          {item.postDescription || 'No description'}
        </Text>
  
        {item.postDescription && item.postDescription.length > 50 && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.seeMore}>
              {isExpanded ? '...See Less' : 'See More...'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  



  const renderItem = ({ item, index }) => {
    console.log(':::::item:::::::', item);
    const isEmpty = !item || (!item.postDescription && !item.postImageUrl && !item.postVideoUrl && !item.postDocumentUrl);
    const images = item.images || [item.postImageUrl] || [];
  
    if (isEmpty) {
      return (
        <View style={styles.centeredView}>
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      );
    }
  
    const isPlaying = playStates[index];

    const handleImageChange = (index) => {
      setImageIndex(index); // Update index on swipe
    };
  
  
    return (
      <GestureHandlerRootView style={styles.container}>
        <TapGestureHandler
          onHandlerStateChange={(event) => {
            if (event.nativeEvent.state === 4) { // 4 corresponds to 'end' of tap gesture
              handleDoubleTap(index);
            }
          }}
          numberOfTaps={2}
        >
          <View style={styles.mainView}>
            <View style={styles.profile}>
              <Image 
                style={styles.profileImage} 
                source={{ uri: item.profileImageUrl || 'http://54.175.246.134/PETAPI/Uploads/UserPost/c98da07e-e7eb-40ae-a68b-c430ae2df5c3_app_logo.png' }} 
              />
              <Text style={styles.username}>{item.postUserName || 'Anonymous'}</Text>
              <View style={styles.stdView}>
                <Text style={styles.std}>{item.postDescription || 'No description'}</Text>
                <Image style={styles.dotIcon} source={require('../../../../assets/images/dotG.png')} />
                <Text style={{ color: 'black', top: -10, left: 20, fontSize: 14 }}>
                  {item.createdDate}
                </Text>
              </View>
            </View>
       
              <PostDescription item={item} />

            {item.postVideoUrl && item.postVideoUrl.length > 0 ? (
              <>
                <Video
                  style={styles.video}
                  source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }} 
                  resizeMode="cover"
                  isLooping
                  shouldPlay={isPlaying}
                  ref={ref => {
                    videoRefs.current[index] = ref; 
                  }}
                />

               <View style={styles.overlay}>
                   <Text style={styles.overtext}>{item.schoolName || 'Unknown School'}</Text> 
                    <Text style={styles.overtextdesc}>{item.postDescription}</Text>  
               </View>

                <TouchableOpacity style={styles.playPauseButton} onPress={() => togglePlayPause(index)}>
                  <Ionicons 
                    name={isPlaying ? 'pause' : 'play'} 
                    size={30} 
                    color="white"      
                  />
                </TouchableOpacity>

              </>
            ) : (
              item.postImageUrl && item.postImageUrl.length > 0 ? (
                <>
                
            <TouchableOpacity
              onPress={() => {
                setIsVisible(true);
                setImageIndex(0); // Reset to the first image when opening
              }}
            >
              <Image
                style={styles.image}
                source={{ uri: images[0] }} // Display the first image
                resizeMode="cover"
              />

           <View style={styles.overlay}>
               <Text style={styles.overtext}>{item.schoolName || 'Unknown School'}</Text> 
               <Text style={styles.overtextdesc}>{item.postDescription}</Text>  
            </View>

            </TouchableOpacity>

      
            <ImageViewing
              images={images.map((image) => ({ uri: image }))} // Map to the required format
              imageIndex={imageIndex}
              visible={visible}
              onRequestClose={() => setIsVisible(false)} // Close the viewer on press
              onChange={handleImageChange} // Update index on swipe
            />
            
           {/* Custom Page Control */}
           {visible && (
              <View style={styles.pagination}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.dot, index === imageIndex && styles.activeDot]}
                  />
                ))}
              </View>
            )}
              </>

              ) : (

                item.postDocumentUrl && item.postDocumentUrl.length > 0 && (
                  <TouchableOpacity style={styles.documentContainer} onPress={() => openDocument(item.postDocumentUrl)}>
                    <Ionicons name="document-text-outline" size={180} color="black"/>
                    <Text style={styles.documentText}>View Document</Text>
                  </TouchableOpacity>                  
                )
              )
            )}
  
            <View style={styles.bottomView}>  
            <ReactionView 
              postId={item.postId} 
              isLike={item.isLike} 
              likeCount={item.likeCount} 
              commentCount={item.commentCount} 
              isCommentDisable={item.isCommentDisable} 
            />
            </View>

          </View>
        </TapGestureHandler>
      </GestureHandlerRootView>
    );
  };
  
  const openDocument = (url) => {
    // Code to handle document opening (e.g., using a document viewer or browser)
    Linking.openURL(url);
  };


  if (status === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <LoaderView />
      </View>
    );
  }

  return (
    <FlatList
      data={feedData}
      renderItem={renderItem}
      keyExtractor={item => (item && item.postId ? item.postId.toString() : Math.random().toString(36).substr(2, 9))}
      vertical={true}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      viewabilityConfig={viewConfigRef.current}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#018CE0',
    padding: 5,
    top: 0,
  },
  mainView: {
    backgroundColor: 'white',
    padding: 5,
    // marginBottom: -70,
    borderRadius: 10,
  },
  profile: {
    height: 70,
    padding: 5
  },
  desc: {
   left: 20,
  },
  postDec: {
    fontWeight: 'bold',
    padding: 15,
    top: 10,
  },
  seeMore: {
    color: '#018CE0', // Customize the color as per your theme
    paddingTop: 10,
    fontWeight: 'bold',
    left: 10
  },
  profileImage: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    left: 50,
    top: -50,
  },
  stdView: {
    top: -50,
    left: 50,
  },
  dotIcon: {
    height: 10,
    width: 10,
    left: 0,
    bottom: -5,
  },
  std: {
    fontSize: 14,
    height: 20,
    width: '70%'
  },
  video: {
    width: Dimensions.get('window').width - 20,
    left: -5,
    height: 310,
    top: 25,
    borderRadius: 5,
    marginBottom: -60,
  },
  documentContainer:{
    width: Dimensions.get('window').width - 20,
    height: 310,
    top: 25,
    borderRadius: 5,
    marginBottom: -60,
  },
  image: {
    width: Dimensions.get('window').width - 20,
    left: -5,
    height: 310,
    top: 25,
    marginBottom: -60,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 90,
    width: Dimensions.get('window').width - 20,
    left: -5,
    bottom: 5
  },
  overtext: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    left: 20,
    top: 20,
    height: 30
  },
  overtextdesc:{
    fontSize: 15,
    color: 'white',
    left: 20,
    top: 20,
    height: 30
  },
  overlayView: {
    bottom: 6,
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    top: '55%', // Position from the top as a percentage of the container's height
    left: '50%', // Position from the left as a percentage of the container's width
    marginLeft: -30, // Adjust horizontal alignment by half of button width (30 is half of 60px button width)
    marginTop: -30, // Adjust vertical alignment by half of button height (30 is half of 60px button height)
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    padding: 10,
    borderRadius: 50,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
  },
  documentText:{
    left: 20,
    color: 'blue',
    textDecorationLine: 'underline', 
  },
  bottomView:{
    height: 50,
    borderRadius: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff', 
  },
});
