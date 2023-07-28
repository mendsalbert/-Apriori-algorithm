// Function to generate all possible candidate itemsets of a given size
function generateCandidates(itemset, size) {
  const candidates = [];
  const length = itemset.length;

  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      const candidate = itemset[i].slice();
      const itemToAdd = itemset[j][size - 2];

      // Check if all previous items are the same
      let valid = true;
      for (let k = 0; k < size - 1; k++) {
        if (candidate[k] !== itemset[j][k]) {
          valid = false;
          break;
        }
      }

      // If previous items are the same, add the new item to the candidate
      if (valid) {
        candidate.push(itemToAdd);
        candidates.push(candidate);
      }
    }
  }

  return candidates;
}

// Function to check if a candidate is a subset of any itemset in the given collection
function isSubset(candidate, itemsets) {
  for (const itemset of itemsets) {
    if (candidate.every((item) => itemset.includes(item))) {
      return true;
    }
  }
  return false;
}

// Function to find frequent itemsets using the Apriori algorithm
function apriori(transactions, minSupport) {
  let itemsets = transactions.map((transaction) =>
    transaction.map((item) => [item])
  );
  const frequentItemsets = [];

  while (itemsets.length > 0) {
    const candidateCounts = {};
    const frequentCandidates = [];

    // Count the occurrences of each candidate
    for (const transaction of transactions) {
      for (const candidate of itemsets) {
        if (isSubset(candidate, transaction)) {
          const candidateStr = candidate.toString();
          candidateCounts[candidateStr] =
            (candidateCounts[candidateStr] || 0) + 1;
        }
      }
    }

    // Filter candidates with support greater than or equal to minSupport
    for (const candidateStr in candidateCounts) {
      const support = candidateCounts[candidateStr] / transactions.length;
      if (support >= minSupport) {
        const candidate = candidateStr.split(",").map((item) => parseInt(item));
        frequentCandidates.push(candidate);
      }
    }

    // Store frequent itemsets for this iteration
    if (frequentCandidates.length > 0) {
      frequentItemsets.push(frequentCandidates);
    }

    // Generate candidates for the next iteration
    itemsets = generateCandidates(
      frequentCandidates,
      frequentCandidates[0].length + 1
    );
  }

  return frequentItemsets;
}

// Example usage
const transactions = [
  ["milk", "bread", "eggs"],
  ["milk", "bread", "butter", "sugar"],
  ["bread", "eggs", "butter"],
  ["milk", "bread", "eggs", "butter"],
  ["milk", "butter", "sugar"],
  ["bread", "sugar"],
  ["milk", "bread", "butter", "sugar"],
  ["milk", "eggs", "butter"],
];

const minSupport = 2;
const frequentItemsets = apriori(transactions, minSupport);

console.log("Frequent Itemsets:");
console.log(frequentItemsets);
