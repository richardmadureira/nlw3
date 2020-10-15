import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';

export default {
    async create(req: Request, res: Response) {
        const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } = req.body;
        const requestImages = req.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename}
        });

        const data = { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends:open_on_weekends === 'true', images };

        const schema = Yup.object().shape({
            name: Yup.string().required('Nome é obrigatório'),
            latitude: Yup.number().required('Latitude é obrigatório'),
            longitude: Yup.number().required('Longitude é obrigatório'),
            about: Yup.string().required('About é obrigatório').max(300),
            instructions: Yup.string().required('instructions é obrigatório'),
            opening_hours: Yup.string().required('opening_hours é obrigatório'),
            open_on_weekends: Yup.boolean().required('open_on_weekends é obrigatório'),
            images: Yup.array(Yup.object().shape({path: Yup.string().required('path é obrigatório')}))
        })

        await schema.validate(data, { abortEarly: false});

        const orphanagesRepository = getRepository(Orphanage);
        const orphanage = orphanagesRepository.create(data);
        const orphanageSaved = await orphanagesRepository.save(orphanage);
        return res.status(201).json(orphanageSaved);
    },

    async findAll(req: Request, res: Response) {
        const orphanages = await getRepository(Orphanage).find({relations: ['images']});
        console.log(orphanages);
        return res.json(orphanageView.renderMany(orphanages));
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const orphanage = await getRepository(Orphanage).findOne(id, {relations: ['images']});
        if (orphanage) {
            await getRepository(Orphanage).delete(id);
            return res.status(200).json({ message: 'ok' })
        }
        return res.status(404);
    },

    async findById(req: Request, res: Response) {
        const { id } = req.params;
        const orphanage = await getRepository(Orphanage).findOneOrFail(id, {relations: ['images']});
        console.log("------------------------");
        console.log(orphanage);
        console.log("------------------------");
        if (orphanage) {
            return res.json(orphanageView.render(orphanage));
        }
        return res.status(404).json({message: 'Orfanato não encontrado'});
    }
}