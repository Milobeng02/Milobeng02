import socket
import threading
import random


class BlackjackGame:
    def __init__(self):
        self.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
        self.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10',
                      'Jack', 'Queen', 'King', 'Ace']
        self.deck = []
        self.player_hand = []
        self.dealer_hand = []
        self.initialize_deck()

    def initialize_deck(self):
        for suit in self.suits:
            for rank in self.ranks:
                self.deck.append(f'{rank} of {suit}')
        random.shuffle(self.deck)

    def deal_cards(self, hand):
        card = self.deck.pop()
        hand.append(card)

    @staticmethod
    def calculate_hand_value(hand):
        value = 0
        has_ace = False

        for card in hand:
            rank = card.split()[0]

            if rank.isdigit():
                value += int(rank)
            elif rank in ['Jack', 'Queen', 'King']:
                value += 10
            elif rank == 'Ace':
                has_ace = True
                value += 11

        if has_ace and value > 21:
            value -= 10

        return value




def display_blackjack_header(client_socket):
    header = [
        "*************************************************************************************************************",
        "*** Welcome to DCS2304084's Blackjack Game ***",
        "*************************************************************************************************************",
        "",
        "",
        " |----------------|  ",
        " |A   __ . __     | ",
        " |   (       )    |-----------------|    ______     ____                   _____        _              ______         ",
        " |    \     /     | K               |    |    |    |    |                  |   |       (_)             |    |         ",
        " |     \   /      |      /\         |    |    |    |    | _______ _________|   | _____ ____ ____  _____|    | ____    ",
        " |      \ /       |     /  \        |    |    |___ |    |/  __  |/        /|   |/    / /  \/   | /   / |    |/   /    ",
        " |----------------|     \  /        |    |  _     \|    |  (__) |        / |       <|  |  |  _ |/   /  |        /     ",
        "                  |      \/         |    | (_)     |    |\______|\_      \ |         \ |  | (_)|    |  |       <      ",
        "                  |-----------------|    |________/|____|     |_| \_______\|___|\_____\|  |__  |\    \ |         \    ",
        "                                                                                       |____/|_| \_____|_____|\___\   ",
        "",
        "",
        "",
        "**************************************************************************************************************"
    ]

    for line in header:
        client_socket.send(line.encode() + b'\r\n')



def get_player_action(client_socket):
    while True:
        client_socket.send('Do you want to hit or stand? (h/s)'.encode())
        action = client_socket.recv(1024).decode().lower().strip()

        # Strip non-alphabetic characters
        #action = ''.join(filter(str.isalpha, action))

        print(f"Received action: '{action}'")

        if action.startswith('h'):
            return 'hit'
        elif action.startswith('s'):
            return 'stand'
        else:

            invalid_msg = '\r\n\nInvalid action! \r\nPlease enter "hit" or "stand".'
            client_socket.send(invalid_msg.encode())

        client_socket.send('Do you want to play another round? (y/n) \r\n'.encode())
        play_again = client_socket.recv(1024).decode().lower().strip()

        if play_again == 'y':
            return 'play_again'
        elif play_again == 'n':
            return 'quit'
        else:
            invalid_msg = '\r\n\nInvalid input! \r\nPlease enter "y" to play again or "n" to quit.'
            client_socket.send(invalid_msg.encode())

def display_blackjack_table(client_socket, player_hand, dealer_hand):
    # Function to display the blackjack table


    client_socket.send("\r\nPlayer hand: {}\r\n".format(player_hand).encode())
    client_socket.send("Dealer hand: {}\r\n".format(dealer_hand).encode())

def handle_client(client_socket, game):
    while True:
        game.player_hand = []
        game.dealer_hand = []

        game.deal_cards(game.player_hand)
        game.deal_cards(game.player_hand)
        game.deal_cards(game.dealer_hand)
        game.deal_cards(game.dealer_hand)

        # Display the blackjack header
        display_blackjack_header(client_socket)

        while True:
            # Display the blackjack table
            display_blackjack_table(client_socket, game.player_hand, game.dealer_hand)

            if game.calculate_hand_value(game.player_hand) > 21:
                client_socket.send('Player busts!\r\n'.encode())
                break

            action = get_player_action(client_socket)

            if action == '':
                game.deal_cards(game.player_hand)
            elif action == 'stand':
                game.deal_cards(game.dealer_hand)
                client_socket.send('\r\n'.encode())
                break
            elif action == 'yes':
                game.deal_cards(game.player_hand)
                game.deal_cards(game.dealer_hand)
                # Start a new round
                break
            elif action == 'no':
                # End the game
                client_socket.send('Thanks for playing!\r\n'.encode())
                return

        # Display the blackjack table after the round endshit
        display_blackjack_table(client_socket, game.player_hand, game.dealer_hand)

        if game.calculate_hand_value(game.player_hand) > 21:
            client_socket.send('Player busts!\r\n'.encode())
        elif game.calculate_hand_value(game.dealer_hand) > 21:
            client_socket.send('Dealer busts! Player wins!\r\n'.encode())
        elif game.calculate_hand_value(game.player_hand) > game.calculate_hand_value(game.dealer_hand):
            client_socket.send('Player wins!\r\n'.encode())
        elif game.calculate_hand_value(game.player_hand) < game.calculate_hand_value(game.dealer_hand):
            client_socket.send('Dealer wins!\r\n'.encode())
        else:
            client_socket.send('Push!\r\n'.encode())

        play_again_msg = 'Do you want to play another round? (y/n) \r\n'
        client_socket.send(play_again_msg.encode())
        play_again = client_socket.recv(1024).decode().lower().strip()

        if play_again != 'y':
            client_socket.send('\r\nThanks for playing!'.encode())
            break


def start_server(host, port, game):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen(5)
    print(f"[*] Listening on {host}:{port}")

    while True:
        client, addr = server.accept()
        print(f"[*] Accepted connection from {addr[0]}:{addr[1]}")
        client_handler = threading.Thread(target=handle_client, args=(client, game))
        client_handler.start()


if __name__ == "__main__":
    blackjack_game = BlackjackGame()

    # Start the server with the specified host and port
    server_thread = threading.Thread(target=start_server, args=('127.0.0.1', 12347, blackjack_game))
    server_thread.start()
