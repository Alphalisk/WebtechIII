<?php

namespace App\Controller;

use App\Entity\Player;
use App\Entity\Game;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Json;
use Twig\Error\Error;

#[Route("/game")]
class GameController extends AbstractController {
    #[Route('/')]
    public function index():Response {
        return new Response("GameController");
    }

    #[Route('/all',methods:['GET'])]
    public function getAllGames(ManagerRegistry $doctrine):Response {
        $em = $doctrine->getManager();
        $game_repo = $em->getRepository(Game::class);
        return new JsonResponse($game_repo->findAll());
    }

    #[Route("/{id}", requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getGame($id, ManagerRegistry $doctrine):Response {
        $em = $doctrine->getManager();
        $game = $em->find(Game::class, $id);
        if ($game) return new JsonResponse($game);
        else return new Response('', 404);
    }


    #[Route('/save', methods:['POST'])]
    public function saveGame(ManagerRegistry $doctrine): Response {
        try {
            $params = json_decode(Request::createFromGlobals()->getContent(), true);

            // Controleer of de JSON-body geldig is
            if (!isset($params['id'], $params['score'])) {
                return new JsonResponse(['error' => 'Missing required fields: id or score'], 400);
            }

            // Haal speler op
            $em = $doctrine->getManager();
            $player = $em->find(Player::class, $params['id']);

            if (!$player) {
                return new JsonResponse(['error' => "Player with id {$params['id']} not found"], 404);
            }

            // Maak en koppel nieuwe game
            $game = new Game($player, $params);
            $player->addGame($game);

            $em->persist($game);
            $em->flush();

            return new JsonResponse(['success' => 'Game created successfully'], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
