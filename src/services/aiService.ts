import { AIPartner, Message } from '../types';

// AIの応答をシミュレートする関数
export const generateAIResponse = async (
  userMessage: string,
  aiPartner: AIPartner,
  conversationHistory: Message[]
): Promise<string> => {
  // 実際のAI APIの代わりに、パートナーの性格に基づいた応答を生成
  const responses = getResponsesByPartner(aiPartner);
  
  // ユーザーのメッセージの内容に基づいて応答を選択
  const response = selectResponse(userMessage, responses, aiPartner);
  
  // 少し遅延を入れて自然な感じにする
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  return response;
};

// パートナー別の応答パターン
const getResponsesByPartner = (partner: AIPartner) => {
  switch (partner.id) {
    case 'robo-kun':
      return {
        greeting: ['こんにちは！', 'よろしくお願いします！', '一緒に頑張りましょう！'],
        encouragement: ['その調子です！', 'よく頑張っていますね！', 'もう少しです！'],
        question: ['どう思いますか？', '他に方法はありますか？', 'どこが難しいですか？'],
        explanation: ['詳しく説明しますね。', '順番に考えていきましょう。', 'ポイントを整理してみましょう。'],
        praise: ['素晴らしいです！', 'よくできました！', '完璧です！']
      };
    case 'kotori-chan':
      return {
        greeting: ['はーい！', 'こんにちは〜', 'よろしくね！'],
        encouragement: ['大丈夫だよ〜', 'ゆっくりでいいのよ', '一緒に頑張ろうね！'],
        question: ['どうかな？', '困ったことはある？', 'もっと教えて〜'],
        explanation: ['わかりやすく説明するね', '一緒に考えてみよう', 'ゆっくり進めようね'],
        praise: ['すごいね〜！', 'よく頑張ったね！', 'やったね！']
      };
    case 'sensei-san':
      return {
        greeting: ['こんにちは！', 'よろしくお願いします！', '一緒に学びましょう！'],
        encouragement: ['その調子です！', 'よく頑張っています！', 'もう一歩です！'],
        question: ['どう考えますか？', '他にアプローチはありますか？', 'どこでつまずいていますか？'],
        explanation: ['詳しく説明しましょう。', '段階的に考えていきましょう。', '重要なポイントを押さえましょう。'],
        praise: ['素晴らしい理解です！', 'よくできました！', '完璧な解答です！']
      };
    default:
      return {
        greeting: ['こんにちは！', 'よろしく！'],
        encouragement: ['頑張ろう！', 'その調子！'],
        question: ['どう思う？', '他には？'],
        explanation: ['説明するね', '一緒に考えよう'],
        praise: ['すごい！', 'よくできた！']
      };
  }
};

// ユーザーのメッセージに基づいて応答を選択
const selectResponse = (userMessage: string, responses: any, partner: AIPartner): string => {
  const message = userMessage.toLowerCase();
  
  // 挨拶系
  if (message.includes('こんにちは') || message.includes('はじめまして') || message.includes('よろしく')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  // 困っている系
  if (message.includes('わからない') || message.includes('難しい') || message.includes('困った')) {
    return `${responses.encouragement[Math.floor(Math.random() * responses.encouragement.length)]} ${responses.question[Math.floor(Math.random() * responses.question.length)]}`;
  }
  
  // 質問系
  if (message.includes('？') || message.includes('?') || message.includes('教えて')) {
    return responses.explanation[Math.floor(Math.random() * responses.explanation.length)];
  }
  
  // 完了系
  if (message.includes('できた') || message.includes('終わった') || message.includes('わかった')) {
    return responses.praise[Math.floor(Math.random() * responses.praise.length)];
  }
  
  // デフォルト応答
  const allResponses = [
    ...responses.encouragement,
    ...responses.question,
    ...responses.explanation
  ];
  
  return allResponses[Math.floor(Math.random() * allResponses.length)];
};

// 学習セッションの要約を生成
export const generateSummary = (messages: Message[], aiPartner: AIPartner): string => {
  const userMessages = messages.filter(m => m.sender === 'user');
  const aiMessages = messages.filter(m => m.sender === 'ai');
  
  const summaryParts = [];
  
  // メッセージ数に基づく評価
  if (userMessages.length >= 5) {
    summaryParts.push('たくさんの質問をして、積極的に学習に取り組んでいましたね！');
  }
  
  // 困っている表現があった場合
  const hasConfusion = userMessages.some(m => 
    m.text.includes('わからない') || m.text.includes('難しい') || m.text.includes('困った')
  );
  
  if (hasConfusion) {
    summaryParts.push('最初は「難しい」と言っていましたが、最後まで諦めずに頑張りました！');
  }
  
  // 完了の表現があった場合
  const hasCompletion = userMessages.some(m => 
    m.text.includes('できた') || m.text.includes('わかった') || m.text.includes('終わった')
  );
  
  if (hasCompletion) {
    summaryParts.push('課題を最後までやり遂げることができました！');
  }
  
  // デフォルトの励まし
  if (summaryParts.length === 0) {
    summaryParts.push('一生懸命に学習に取り組んでいました！');
  }
  
  return summaryParts.join(' ');
}; 