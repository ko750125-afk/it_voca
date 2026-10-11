import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { useAudioPlayer } from 'expo-audio';
import { Term, Settings } from '../database/crud';

const flipSoundSource = require('../../assets/sounds/card-flip.wav');

interface Props {
  term: Term;
  settings: Settings;
}

export default function Flashcard({ term, settings }: Props) {
  const isFlipped = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);
  const player = useAudioPlayer(flipSoundSource);

  // Masking states (false = hidden by mask, true = revealed)
  const [showPronunciation, setShowPronunciation] = useState(!settings.maskPronunciation);
  const [showFullName, setShowFullName] = useState(!settings.maskFullName);
  const [showMeaning, setShowMeaning] = useState(!settings.maskMeaning);
  const [showExplanation, setShowExplanation] = useState(!settings.maskExplanation);

  useEffect(() => {
    // Reset masks and flip state when term changes
    setFlipped(false);
    isFlipped.value = 0;
    setShowPronunciation(!settings.maskPronunciation);
    setShowFullName(!settings.maskFullName);
    setShowMeaning(!settings.maskMeaning);
    setShowExplanation(!settings.maskExplanation);
  }, [term, settings]);

  const handleFlip = () => {
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // Ignore audio error gracefully
    }
    const nextFlipped = !flipped;
    setFlipped(nextFlipped);
    isFlipped.value = withTiming(nextFlipped ? 1 : 0, { duration: 350 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(isFlipped.value, [0, 0.49, 0.5, 1], [1, 0.1, 0, 0]),
      zIndex: isFlipped.value < 0.5 ? 2 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(isFlipped.value, [0, 0.49, 0.5, 1], [0, 0, 0.1, 1]),
      zIndex: isFlipped.value > 0.5 ? 2 : 1,
    };
  });

  const MaskableItem = ({ 
    content, 
    isRevealed, 
    onReveal, 
    textStyle, 
    containerStyle 
  }: { 
    content: string, 
    isRevealed: boolean, 
    onReveal: () => void, 
    textStyle: any, 
    containerStyle?: any 
  }) => {
    if (!content) return null;
    
    if (!isRevealed) {
      return (
        <View style={containerStyle}>
          <Pressable 
            onPress={onReveal} 
            style={styles.maskContainer}
          >
            <View style={styles.maskBlock}>
              <Text style={styles.maskHint}>탭하여 확인</Text>
            </View>
          </Pressable>
        </View>
      );
    }
    
    return (
      <View style={containerStyle} pointerEvents="none">
        <Text style={textStyle}>{content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        
        {/* Front Card */}
        <Animated.View 
          style={[styles.card, styles.frontCard, frontAnimatedStyle]}
          pointerEvents={flipped ? 'none' : 'auto'}
        >
          <Pressable style={styles.pressableFill} onPress={handleFlip}>
            <Text style={styles.frontTerm}>{term.term}</Text>
          </Pressable>
        </Animated.View>

        {/* Back Card */}
        <Animated.View 
          style={[styles.card, styles.backCard, backAnimatedStyle]}
          pointerEvents={flipped ? 'auto' : 'none'}
        >
          <ScrollView 
            contentContainerStyle={styles.backScroll} 
            showsVerticalScrollIndicator={false}
          >
            <Pressable style={styles.backPressableArea} onPress={handleFlip}>
              {/* Pronunciation: 가장 크고 강조된 글씨 */}
              <MaskableItem 
                content={term.pronunciation}
                isRevealed={showPronunciation}
                onReveal={() => setShowPronunciation(true)}
                textStyle={styles.pronunciation}
                containerStyle={styles.itemSpacing}
              />
              
              {/* Full Name: 작고 차분한 보조 색상 (약자인 경우만) */}
              <MaskableItem 
                content={term.fullName}
                isRevealed={showFullName}
                onReveal={() => setShowFullName(true)}
                textStyle={styles.fullName}
                containerStyle={styles.itemSpacing}
              />
              
              {/* Meaning: 중간 크기의 굵은 글씨 */}
              <MaskableItem 
                content={term.meaning}
                isRevealed={showMeaning}
                onReveal={() => setShowMeaning(true)}
                textStyle={styles.meaning}
                containerStyle={styles.itemSpacing}
              />
              
              {/* Explanation: 가독성 좋은 본문 글씨 */}
              <MaskableItem 
                content={term.explanation}
                isRevealed={showExplanation}
                onReveal={() => setShowExplanation(true)}
                textStyle={styles.explanation}
                containerStyle={styles.itemSpacing}
              />
            </Pressable>
          </ScrollView>
        </Animated.View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardWrapper: {
    width: '90%',
    height: '80%',
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    backfaceVisibility: 'hidden',
  },
  frontCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backCard: {
    overflow: 'hidden',
  },
  pressableFill: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backScroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backPressableArea: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  frontTerm: {
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  itemSpacing: {
    marginBottom: 20,
    width: '100%',
  },
  maskContainer: {
    width: '100%',
    minHeight: 44,
    borderRadius: 10,
    overflow: 'hidden',
  },
  maskBlock: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    borderWidth: 1,
    borderColor: '#e5e5ea',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  maskHint: {
    fontSize: 13,
    color: '#8e8e93',
    fontWeight: '500',
  },
  pronunciation: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007AFF',
    textAlign: 'center',
  },
  fullName: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: -8,
  },
  meaning: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1e',
    lineHeight: 28,
  },
  explanation: {
    fontSize: 16,
    lineHeight: 26,
    color: '#3a3a3c',
  }
});
