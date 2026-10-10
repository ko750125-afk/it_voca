import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { Term, Settings } from '../database/crud';

interface Props {
  term: Term;
  settings: Settings;
}

export default function Flashcard({ term, settings }: Props) {
  const isFlipped = useSharedValue(0);

  // Masking states (false = hidden by mask, true = revealed)
  const [showPronunciation, setShowPronunciation] = useState(!settings.maskPronunciation);
  const [showFullName, setShowFullName] = useState(!settings.maskFullName);
  const [showMeaning, setShowMeaning] = useState(!settings.maskMeaning);
  const [showExplanation, setShowExplanation] = useState(!settings.maskExplanation);

  useEffect(() => {
    // Reset masks and flip state when term changes
    isFlipped.value = 0;
    setShowPronunciation(!settings.maskPronunciation);
    setShowFullName(!settings.maskFullName);
    setShowMeaning(!settings.maskMeaning);
    setShowExplanation(!settings.maskExplanation);
  }, [term, settings]);

  const handleFlip = () => {
    isFlipped.value = withTiming(isFlipped.value === 0 ? 1 : 0, { duration: 400 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(isFlipped.value, [0, 0.5, 1], [1, 0, 0]),
      zIndex: isFlipped.value < 0.5 ? 2 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(isFlipped.value, [0, 0.5, 1], [0, 0, 1]),
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
        <Pressable onPress={onReveal} style={[styles.maskContainer, containerStyle]}>
          <View style={styles.maskBlock} />
        </Pressable>
      );
    }
    
    return (
      <View style={containerStyle}>
        <Text style={textStyle}>{content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.cardWrapper} onPress={handleFlip}>
        
        {/* Front */}
        <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
          <Text style={styles.frontTerm}>{term.term}</Text>
        </Animated.View>

        {/* Back */}
        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          <ScrollView contentContainerStyle={styles.backScroll} showsVerticalScrollIndicator={false}>
            <Pressable>
              {/* Pronunciation: 가장 크고 강조된 글씨 */}
              <MaskableItem 
                content={term.pronunciation}
                isRevealed={showPronunciation}
                onReveal={() => setShowPronunciation(true)}
                textStyle={styles.pronunciation}
                containerStyle={styles.itemSpacing}
              />
              
              {/* Full Name: 작고 차분한 보조 색상 */}
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
        
      </Pressable>
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
    height: '75%',
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    backfaceVisibility: 'hidden',
    padding: 24,
  },
  frontCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCard: {
    // Back card content styling handled by ScrollView
  },
  frontTerm: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  backScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemSpacing: {
    marginBottom: 24,
    width: '100%',
  },
  maskContainer: {
    width: '100%',
    minHeight: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  maskBlock: {
    flex: 1,
    backgroundColor: '#e0e0e0',
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
    marginTop: -16, // 줄임
  },
  meaning: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  explanation: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3a3a3c',
  }
});
