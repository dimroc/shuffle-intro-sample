script {
    use Sender::NFT;

    fun new_script<NFTType: store + drop>(account: signer) {
      NFT::initialize<NFTType>(&account);
    }
}
