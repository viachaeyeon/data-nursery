def get_or_create(session, model, **kwargs):
    # .order_by(models.PlanterWork.created_at.desc())
    instance = (
        session.query(model)
        .filter_by(**kwargs)
        .order_by(model.created_at.desc())
        .first()
    )
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        session.refresh(instance)
        return instance
