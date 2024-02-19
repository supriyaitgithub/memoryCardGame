import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import shuffle from 'lodash.shuffle';

const characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const shuffledCharacters = shuffle([...characters, ...characters]);
    setCards(shuffledCharacters.map(char => ({ char, flipped: false, matched: false })));
    setFlippedIndices([]);
    setAttempts(0);
    setMatches(0);
  }, []);

  const handleCardPress = index => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) {
      return;
    }

    setCards(prevState =>
      prevState.map((card, i) => (i === index ? { ...card, flipped: true } : card))
    );
    setFlippedIndices(prevState => [...prevState, index]);

    if (flippedIndices.length === 1) {
      const [firstIndex] = flippedIndices;
      if (cards[firstIndex].char === cards[index].char) {
        setMatches(matches + 1);
        setCards(prevState =>
          prevState.map((card, i) =>
            i === index || i === firstIndex ? { ...card, matched: true } : card
          )
        );
      }
      setTimeout(() => {
        setCards(prevState =>
          prevState.map((card, i) =>
            i === index || i === firstIndex ? { ...card, flipped: false } : card
          )
        );
        setFlippedIndices([]);
        setAttempts(attempts + 1);
      }, 1000);
    } else {
      setAttempts(attempts + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Attempts: {attempts}</Text>
      <Text>Matches: {matches}</Text>
      <View style={styles.grid}>
        {cards.map(({ char, flipped, matched }, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, flipped || matched ? styles.cardFlipped : null]}
            onPress={() => handleCardPress(index)}
            activeOpacity={0.8}>
            <Text>{flipped || matched ? char : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    marginLeft: 20,
  },
  card: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  cardFlipped: {
    backgroundColor: 'lightblue',
  },
});

export default MemoryGame;
